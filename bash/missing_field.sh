#!/bin/bash

curl -X POST "http://localhost:7071/api/processOrder" \
     -H "Content-Type: application/json" \
     -d '{"orderId":"12345","customer":"Max Mustermann","items":["Laptop","Maus"]}'
