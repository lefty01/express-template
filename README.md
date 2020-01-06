# express-ssl-template
node.js express with pug

This is basically the express (version 4.13.4) default project layout modified to use pug.

# Generate self signed SSL cert:
- openssl genrsa -out ssl_private.key 2048
- openssl req -new -key ssl_private.key -out ssl_private.csr
- openssl x509 -req -in ssl_private.csr -CA myCA.pem -CAkey myCA.key -CAcreateserial -out ssl_certificate.cer -days 3650 -sha256 -extfile ssl.ext 

## ssl.ext
```
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = foo.bar
```

## the CA used above can be generated via:
- openssl genrsa -des3 -out myCA.key 2048
- openssl req -x509 -new -nodes -key myCA.key -sha256 -days 1825 -out myCA.pem


## usage:
```javascript
var ssl_options = {
    key:  fs.readFileSync('ssl_private.key'),
    cert: fs.readFileSync('ssl_certificate.cer'),
...
};
```
