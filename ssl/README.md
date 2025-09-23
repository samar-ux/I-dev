# SSL Configuration for ICP Canister 93343-A7BDB-4F45F
# تكوين SSL لـ ICP Canister 93343-A7BDB-4F45F

## SSL Certificates

This directory contains SSL certificates for the ICP Canister 93343-A7BDB-4F45F.

هذا المجلد يحتوي على شهادات SSL لـ ICP Canister 93343-A7BDB-4F45F.

## Files Required

- `cert.pem` - SSL Certificate
- `key.pem` - Private Key
- `chain.pem` - Certificate Chain (optional)

## Generating Self-Signed Certificates

For development purposes, you can generate self-signed certificates:

```bash
# Generate private key
openssl genrsa -out key.pem 2048

# Generate certificate
openssl req -new -x509 -key key.pem -out cert.pem -days 365 -subj "/CN=93343-A7BDB-4F45F.ic0.app"

# Generate certificate chain (optional)
cat cert.pem > chain.pem
```

## Production Certificates

For production, use certificates from a trusted CA like Let's Encrypt:

```bash
# Install certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d 93343-A7BDB-4F45F.ic0.app

# Copy certificates
sudo cp /etc/letsencrypt/live/93343-A7BDB-4F45F.ic0.app/fullchain.pem ./cert.pem
sudo cp /etc/letsencrypt/live/93343-A7BDB-4F45F.ic0.app/privkey.pem ./key.pem
```

## Security Notes

- Keep private keys secure
- Use strong encryption (2048-bit RSA minimum)
- Regularly renew certificates
- Monitor certificate expiry

## File Permissions

```bash
chmod 600 key.pem
chmod 644 cert.pem
chmod 644 chain.pem
```
