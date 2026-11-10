# Learn gRPC — A Practical Guide

This guide teaches gRPC from the ground up, assuming you already know **REST APIs**, **JSON**, and backend work in **Python** or **Node.js**. If you've used **MQTT** or **WebSockets** for real-time data, you'll see where gRPC fits in that picture too.

---

## Table of Contents

1. [The Problem gRPC Solves](#1-the-problem-grpc-solves)
2. [Core Idea in 60 Seconds](#2-core-idea-in-60-seconds)
3. [Protocol Buffers (protobuf)](#3-protocol-buffers-protobuf)
4. [The Four Types of RPC](#4-the-four-types-of-rpc)
5. [Hands-On: Your First gRPC Service (Python)](#5-hands-on-your-first-grpc-service-python)
6. [Same Service in Node.js](#6-same-service-in-nodejs)
7. [Streaming in Practice](#7-streaming-in-practice)
8. [gRPC vs REST vs MQTT/WebSocket](#8-grpc-vs-rest-vs-mqttwebsocket)
9. [Production Topics](#9-production-topics)
10. [Common Mistakes](#10-common-mistakes)
11. [When to Use gRPC (and When Not To)](#11-when-to-use-grpc-and-when-not-to)
12. [Next Steps](#12-next-steps)

---

## 1. The Problem gRPC Solves

With REST, a typical flow looks like this:

```
Client                          Server
  |                               |
  |--- GET /users/42 ------------>|
  |                               | parse URL, route handler
  |                               | query DB
  |                               | serialize User -> JSON
  |<-- 200 {"id":42,"name":"..."}-|
```

REST is human-readable and works everywhere (browsers, curl, Postman). But it has costs:

| REST pain point | Why it hurts |
|-----------------|--------------|
| JSON text | Larger payloads, slower parse/serialize |
| No strict schema | `"age": "twenty"` slips through until runtime |
| HTTP/1.1 overhead | One request per connection (unless HTTP/2) |
| No first-class streaming | You bolt on WebSockets or SSE separately |
| Documentation drift | OpenAPI spec and code can diverge |

**gRPC** is Google's answer: a **binary**, **schema-first**, **HTTP/2-based** RPC framework. You define a `.proto` file (the contract), generate client/server code, and call remote functions like local ones.

Think of it as: **"What if REST had a compiled interface, ran on HTTP/2, and felt like calling a function?"**

---

## 2. Core Idea in 60 Seconds

```
┌─────────────┐     HTTP/2 + binary protobuf     ┌─────────────┐
│   Client    │ ───────────────────────────────> │   Server    │
│  (stub)     │   GetUser({ id: 42 })            │  (service)  │
│             │ <─────────────────────────────── │             │
└─────────────┘   User { id: 42, name: "..." }   └─────────────┘
```

**Key terms:**

| Term | Meaning |
|------|---------|
| **Service** | A collection of RPC methods (like a REST resource group) |
| **RPC** | Remote Procedure Call — one method on that service |
| **Message** | A struct defined in `.proto` (like a JSON object, but typed) |
| **Stub** | Generated client code that hides the network |
| **Server** | Implements the service interface you generated |

REST says: *"Here's a URL and a verb."*  
gRPC says: *"Here's a function signature; call it."*

---

## 3. Protocol Buffers (protobuf)

Protobuf is the **serialization format** and **IDL** (interface definition language) gRPC uses.

### Example: `user.proto`

```protobuf
syntax = "proto3";

package user;

// A message = one data structure
message GetUserRequest {
  int32 id = 1;   // field number 1 — never reuse numbers after deletion
}

message User {
  int32 id = 1;
  string name = 2;
  string email = 3;
}

// A service = your API surface
service UserService {
  rpc GetUser(GetUserRequest) returns (User);
}
```

### Field numbers matter

The `= 1`, `= 2` tags are **wire identifiers**, not default values. Once deployed, **never change a field's number** — old clients would misread data. To rename, keep the number; to remove, mark `reserved`.

### Scalar types you'll use daily

| proto3 | Python | TypeScript/Node | Notes |
|--------|--------|-----------------|-------|
| `string` | `str` | `string` | UTF-8 |
| `int32` / `int64` | `int` | `number` | Use `int64` for large IDs |
| `bool` | `bool` | `boolean` | |
| `bytes` | `bytes` | `Buffer` | Raw binary |
| `float` / `double` | `float` | `number` | |
| `repeated T` | `list[T]` | `T[]` | Like JSON arrays |
| `map<K,V>` | `dict` | `Map` | Key-value |

### Enums, optional fields, oneof

```protobuf
enum OrderStatus {
  ORDER_STATUS_UNSPECIFIED = 0;  // always have a zero default
  PENDING = 1;
  SHIPPED = 2;
}

message Order {
  int32 id = 1;
  OrderStatus status = 2;

  // proto3 "optional" restores explicit presence (useful for PATCH-like updates)
  optional string tracking_code = 3;

  oneof payment {
    string card_last_four = 4;
    string upi_id = 5;
  }
}
```

---

## 4. The Four Types of RPC

This is where gRPC shines compared to plain REST.

```
1. UNARY (request -> response)
   Client:  [====request====]                    [====response====]  Server

2. SERVER STREAMING (one request, many responses)
   Client:  [====request====]  <--- chunk --- chunk --- chunk ---  Server

3. CLIENT STREAMING (many requests, one response)
   Client:  --- chunk --- chunk --- chunk --->  [====response====]  Server

4. BIDIRECTIONAL STREAMING (many both ways)
   Client:  <--- chunk ---> <--- chunk ---> <--- chunk --->  Server
```

| Type | REST equivalent | Real-world use |
|------|-----------------|----------------|
| Unary | `GET /user/42` | CRUD, auth, payments |
| Server streaming | SSE, long-poll | Live score feed, log tail, stock ticks |
| Client streaming | chunked upload | File upload, batch metrics ingest |
| Bidirectional | WebSocket | Chat, live game state, collaborative editing |

**MQTT** is pub/sub over a broker; **gRPC streaming** is point-to-point RPC streams over HTTP/2. Different tools — see [section 8](#8-grpc-vs-rest-vs-mqttwebsocket).

---

## 5. Hands-On: Your First gRPC Service (Python)

### Step 0: Install

```bash
pip install grpcio grpcio-tools
```

### Step 1: Create `protos/user.proto`

Use the proto from [section 3](#3-protocol-buffers-protobuf).

### Step 2: Generate Python code

```bash
python -m grpc_tools.protoc \
  -I./protos \
  --python_out=./generated \
  --grpc_python_out=./generated \
  ./protos/user.proto
```

This produces:

- `user_pb2.py` — message classes
- `user_pb2_grpc.py` — service stub + servicer base class

**Commit the `.proto` file.** Generated code can be committed or regenerated in CI — pick one approach and stick to it.

### Step 3: Implement the server

```python
# server.py
from concurrent import futures
import grpc

import user_pb2
import user_pb2_grpc


class UserService(user_pb2_grpc.UserServiceServicer):
    def GetUser(self, request, context):
        # request.id comes from GetUserRequest
        if request.id <= 0:
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            context.set_details("id must be positive")
            return user_pb2.User()

        # Fake DB lookup
        users = {
            42: user_pb2.User(id=42, name="Goutham", email="gouthamdoddi97@gmail.com"),
        }
        user = users.get(request.id)
        if not user:
            context.set_code(grpc.StatusCode.NOT_FOUND)
            context.set_details(f"user {request.id} not found")
            return user_pb2.User()

        return user


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    user_pb2_grpc.add_UserServiceServicer_to_server(UserService(), server)
    server.add_insecure_port("[::]:50051")
    server.start()
    print("gRPC server listening on :50051")
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
```

### Step 4: Call it from a client

```python
# client.py
import grpc
import user_pb2
import user_pb2_grpc


def main():
    with grpc.insecure_channel("localhost:50051") as channel:
        stub = user_pb2_grpc.UserServiceStub(channel)
        response = stub.GetUser(user_pb2.GetUserRequest(id=42))
        print(f"Got user: {response.name} <{response.email}>")


if __name__ == "__main__":
    main()
```

### Step 5: Run

```bash
# terminal 1
python server.py

# terminal 2
python client.py
# Got user: Goutham <gouthamdoddi97@gmail.com>
```

You just did **unary RPC**: one request, one response, strongly typed end to end.

---

## 6. Same Service in Node.js

```bash
npm install @grpc/grpc-js @grpc/proto-loader
```

```javascript
// server.js
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, "protos/user.proto"),
  { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true }
);
const userProto = grpc.loadPackageDefinition(packageDefinition).user;

const users = {
  42: { id: 42, name: "Goutham", email: "gouthamdoddi97@gmail.com" },
};

function getUser(call, callback) {
  const user = users[call.request.id];
  if (!user) {
    return callback({ code: grpc.status.NOT_FOUND, details: "user not found" });
  }
  callback(null, user);
}

const server = new grpc.Server();
server.addService(userProto.UserService.service, { GetUser: getUser });
server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), () => {
  server.start();
  console.log("gRPC server on :50051");
});
```

```javascript
// client.js
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, "protos/user.proto"),
  { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true }
);
const userProto = grpc.loadPackageDefinition(packageDefinition).user;

const client = new userProto.UserService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

client.GetUser({ id: 42 }, (err, response) => {
  if (err) return console.error(err.message);
  console.log(`Got user: ${response.name}`);
});
```

**Python** tends to use code generation (`protoc`); **Node** often loads `.proto` at runtime with `@grpc/proto-loader`. Both are valid.

---

## 7. Streaming in Practice

Extend your proto:

```protobuf
service UserService {
  rpc GetUser(GetUserRequest) returns (User);
  rpc ListUsers(ListUsersRequest) returns (stream User);           // server streaming
  rpc CreateUsers(stream CreateUserRequest) returns (CreateUsersResponse);  // client streaming
  rpc Chat(stream ChatMessage) returns (stream ChatMessage);       // bidirectional
}

message ListUsersRequest {
  int32 page_size = 1;
}
```

### Server streaming (Python)

```python
def ListUsers(self, request, context):
    for user in ALL_USERS[: request.page_size]:
        yield user  # each yield sends one message to the client
```

### Client consuming server stream

```python
for user in stub.ListUsers(user_pb2.ListUsersRequest(page_size=10)):
    print(user.name)
```

### Bidirectional streaming — mental model

```python
# Server
def Chat(self, request_iterator, context):
    for incoming in request_iterator:
        reply = process(incoming)
        yield reply

# Client
def generate_messages():
    while True:
        text = input("> ")
        yield chat_pb2.ChatMessage(text=text)

responses = stub.Chat(generate_messages())
for msg in responses:
    print("peer:", msg.text)
```

HTTP/2 multiplexes these streams on **one TCP connection**. That's efficient for microservices talking constantly.

---

## 8. gRPC vs REST vs MQTT/WebSocket

You've built systems with **REST**, **MQTT over WebSocket**, and **Redis pub/sub**. Here's how they compare:

```
                    REST          gRPC              MQTT/WebSocket
─────────────────────────────────────────────────────────────────────
Wire format         JSON/text     Protobuf binary   Often JSON/binary
Transport           HTTP/1.1/2    HTTP/2            TCP/WebSocket
Browser-native      Yes           No*               Yes (WS)
Schema              Optional      Required (.proto) Ad-hoc
Streaming           Bolt-on       Built-in          Built-in
Best for            Public APIs   Service-to-service Real-time fan-out
                    CRUD          Internal microsvcs  Many subscribers
```

\* Browsers don't speak gRPC natively. Use **gRPC-Web** (Envoy proxy) or expose REST at the edge and gRPC internally.

### Mapping to your experience

| What you built | Closest gRPC pattern |
|----------------|----------------------|
| REST payment webhooks | Unary RPC + idempotency keys |
| MQTT live stake broadcasts | Server streaming or bidirectional streaming |
| Redis pub/sub | Not the same — gRPC is point-to-point; add a message bus if you need fan-out |
| Django REST endpoints | gRPC service methods with typed request/response |

**Rule of thumb:**  
- **External clients (web, mobile via API gateway)** → REST or GraphQL at the edge  
- **Internal services (order service ↔ inventory service)** → gRPC  
- **Thousands of clients needing broadcast** → MQTT/WebSocket + broker  

---

## 9. Production Topics

### TLS (always in production)

```python
# Server
server_credentials = grpc.ssl_server_credentials(
    [(private_key, certificate_chain)]
)
server.add_secure_port("[::]:50051", server_credentials)

# Client
credentials = grpc.ssl_channel_credentials(root_certificates=ca_cert)
channel = grpc.secure_channel("api.example.com:443", credentials)
```

### Deadlines and cancellation

```python
# Client: fail if server doesn't respond in 2 seconds
response = stub.GetUser(
    user_pb2.GetUserRequest(id=42),
    timeout=2.0,
)

# Server: check if client gave up
if context.is_active():
    ...
```

### Metadata (like HTTP headers)

```python
# Client sends auth token
metadata = (("authorization", "Bearer eyJ..."),)
stub.GetUser(request, metadata=metadata)

# Server reads it
def GetUser(self, request, context):
    for key, value in context.invocation_metadata():
        if key == "authorization":
            ...
```

### Interceptors (middleware)

```python
class LoggingInterceptor(grpc.ServerInterceptor):
    def intercept_service(self, continuation, handler_call_details):
        print(f"RPC: {handler_call_details.method}")
        return continuation(handler_call_details)

server = grpc.server(
    futures.ThreadPoolExecutor(max_workers=10),
    interceptors=[LoggingInterceptor()],
)
```

Same idea as Django middleware or Express middleware — auth, logging, tracing, rate limits.

### Observability

- **OpenTelemetry** has first-class gRPC instrumentation
- Status codes map to `grpc.StatusCode`: `NOT_FOUND`, `INVALID_ARGUMENT`, `DEADLINE_EXCEEDED`, etc.
- Health checks: standard `grpc.health.v1.Health` service

### grpcurl — curl for gRPC

```bash
# List services (requires server reflection enabled)
grpcurl -plaintext localhost:50051 list

# Call a method
grpcurl -plaintext -d '{"id": 42}' localhost:50051 user.UserService/GetUser
```

---

## 10. Common Mistakes

| Mistake | Fix |
|---------|-----|
| Reusing/changing protobuf field numbers | Never. Use `reserved` for deleted fields |
| Giant messages (>4 MB default) | Split into chunks, use streaming, or raise `max_send_message_length` deliberately |
| No deadlines | Always set client timeouts; hung RPCs tie up thread pools |
| `insecure_channel` in production | Use TLS + mTLS for service mesh |
| Exposing gRPC directly to browsers | Put REST/GraphQL or gRPC-Web in front |
| Ignoring `UNIMPLEMENTED` | Version your proto package (`v1`, `v2`) instead of breaking clients |
| Blocking the server thread | Offload CPU-heavy work; streaming handlers shouldn't block the pool |

---

## 11. When to Use gRPC (and When Not To)

### Use gRPC when:

- Microservices talk to each other internally (Python ↔ Go ↔ Rust)
- You need **low latency** and **small payloads** at high QPS
- **Streaming** is core (live feeds, log pipelines, file transfer)
- You want **one source of truth** for API contracts (`.proto` files)
- You're on **Kubernetes** with service mesh (Istio, Linkerd — built for gRPC)

### Skip gRPC when:

- You're building a **public HTTP API** consumed by browsers directly
- Team prefers **JSON + OpenAPI** and fast iteration without code generation
- You need **human-debuggable** traffic in browser DevTools
- Organization has no protobuf tooling maturity yet

---

## 12. Next Steps

### Exercises (do these in order)

1. **Add `CreateUser` unary RPC** — validate email, return `ALREADY_EXISTS` on duplicate
2. **Add `ListUsers` server stream** — paginate with `page_size` and `page_token`
3. **Add a deadline** — make the server sleep 5s; client timeout 1s; catch `DEADLINE_EXCEEDED`
4. **Add auth interceptor** — reject calls without `authorization` metadata
5. **Compare payload size** — same 10k users as JSON REST vs protobuf; measure bytes

### Tools to explore

| Tool | Purpose |
|------|---------|
| [Buf](https://buf.build) | Modern protobuf lint, breaking-change detection, codegen |
| [grpcurl](https://github.com/fullstorydev/grpcurl) | CLI testing |
| [Postman](https://www.postman.com) | gRPC requests (GUI) |
| [Evans](https://github.com/ktr0731/evans) | Interactive gRPC client |
| [gRPC-Web](https://github.com/grpc/grpc-web) | Browser clients via proxy |

### Read next

- [Official gRPC docs](https://grpc.io/docs/)
- [Protocol Buffers language guide](https://protobuf.dev/programming-guides/proto3/)
- [Google API Design Guide](https://cloud.google.com/apis/design) — naming, pagination, errors (applies to gRPC too)

---

## Quick Reference Card

```
Define     ->  user.proto
Generate   ->  protoc / buf generate
Implement  ->  class UserService(UserServiceServicer)
Register   ->  add_UserServiceServicer_to_server(...)
Listen     ->  server.add_insecure_port("[::]:50051")  # dev only
Call       ->  stub.GetUser(request, timeout=2.0)

Errors     ->  context.set_code(grpc.StatusCode.NOT_FOUND)
Stream out ->  yield message
Stream in  ->  for msg in request_iterator: ...
```

---

*This file lives at `docs/learn-grpc.md` in your retro-port project. It's standalone — nothing in the app imports it. Run the Python examples in any empty folder by copying the snippets above.*
