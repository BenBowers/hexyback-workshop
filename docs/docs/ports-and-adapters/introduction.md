---
sidebar_position: 1
tags:
  - ports adapters introduction
---

# Introduction

In the ports and adapters model, the application is divided into two distinct parts:

- The _"inside"_ part, which contains the business logic, including the **use cases**
- The _"outside"_ part, which consists of **adpaters** that connect to external systems (e.g. datbases, web interfaces, 3rd party services)

The _"ports"_ are interfaces that define how external systems can communicate with the application's business logic (**use cases**). **Adapters** implement these **ports** to translate between the external systems and the application's core logic.

![Ports and Adaptors Hexagonal Diagram](/img/ports-and-adapters-hexagon.svg)
