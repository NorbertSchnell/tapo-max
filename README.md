# Tapo Blinkers

## Setting up

Create a file *setup.js* with the following content:

```
// user name (email address) and password of the TP-Link Tapo account the devices are associated to
const username = 'peter.pan@doma.in'; 
const password = 'thisispeterspassword';

// IP addresses of the devices to be controlled
const ipAddresses = [ 
	'192.168.0.10',
	'192.168.0.11',
	'192.168.0.12',
];
```

## Starting up

```
node tapo-light-control.js
```

## Tapo L510E (Version 1) manual

https://www.tp-link.com/de/support/download/tapo-l510e/
