# Code Signing Guide

Code signing is optional but recommended for production releases to avoid Windows security warnings.

## Why Code Sign?

- **User Trust**: Signed applications don't show "Unknown Publisher" warnings
- **Security**: Users can verify the application hasn't been tampered with
- **Professional**: Makes your application look more professional
- **Distribution**: Some distribution channels require signed applications

## Option 1: Self-Signed Certificate (Development/Testing)

### Prerequisites
- OpenSSL installed
- Windows SDK (for signtool.exe) - Optional

### Step 1: Generate Self-Signed Certificate

```bash
# Generate private key and certificate
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes

# Convert to PFX format (Windows)
openssl pkcs12 -export -out certificate.pfx -inkey key.pem -in cert.pem
```

**Note**: You'll be prompted for:
- Certificate password (remember this!)
- Certificate information (name, organization, etc.)

### Step 2: Configure electron-builder

Add to `package.json` under `build.win`:

```json
{
  "build": {
    "win": {
      "certificateFile": "certificate.pfx",
      "certificatePassword": "your-password-here"
    }
  }
}
```

**Security Note**: Don't commit the password to git! Use environment variables:

```json
{
  "build": {
    "win": {
      "certificateFile": "certificate.pfx",
      "certificatePassword": "${env.CERTIFICATE_PASSWORD}"
    }
  }
}
```

Then set the environment variable:
```bash
# PowerShell
$env:CERTIFICATE_PASSWORD = "your-password"

# CMD
set CERTIFICATE_PASSWORD=your-password
```

### Step 3: Build

```bash
bun run build
```

**Note**: Self-signed certificates will still show a warning, but it's better than no signing.

## Option 2: Commercial Code Signing Certificate

### Where to Buy

- **DigiCert**: https://www.digicert.com/
- **Sectigo (formerly Comodo)**: https://sectigo.com/
- **GlobalSign**: https://www.globalsign.com/
- **SSL.com**: https://www.ssl.com/

**Cost**: Typically $200-$500 per year

### Step 1: Purchase Certificate

1. Choose a certificate authority (CA)
2. Purchase a code signing certificate
3. Complete identity verification (required)
4. Download the certificate

### Step 2: Install Certificate

1. Double-click the certificate file (.pfx or .p12)
2. Import to "Personal" certificate store
3. Enter the certificate password
4. Verify installation:
   - Open Certificate Manager (certmgr.msc)
   - Check "Personal" → "Certificates"
   - Your certificate should be listed

### Step 3: Configure electron-builder

#### Option A: Use Certificate Store

```json
{
  "build": {
    "win": {
      "signingHashAlgorithms": ["sha256"],
      "certificateFile": "path/to/certificate.pfx",
      "certificatePassword": "${env.CERTIFICATE_PASSWORD}",
      "timeStampServer": "http://timestamp.digicert.com"
    }
  }
}
```

#### Option B: Use Certificate from Store

If certificate is in Windows certificate store:

```json
{
  "build": {
    "win": {
      "signingHashAlgorithms": ["sha256"],
      "certificateSubjectName": "Your Certificate Name",
      "timeStampServer": "http://timestamp.digicert.com"
    }
  }
}
```

### Step 4: Build

```bash
# Set password if using PFX file
$env:CERTIFICATE_PASSWORD = "your-password"
bun run build
```

## Timestamp Server

Always use a timestamp server to ensure signatures remain valid after certificate expiration:

```json
{
  "build": {
    "win": {
      "timeStampServer": "http://timestamp.digicert.com"
    }
  }
}
```

Available timestamp servers:
- DigiCert: `http://timestamp.digicert.com`
- Sectigo: `http://timestamp.sectigo.com`
- GlobalSign: `http://timestamp.globalsign.com/tsa/r6advanced1`

## Verification

### Verify Signature

After building, verify the signature:

```bash
# Using signtool (Windows SDK)
signtool verify /pa "dist\نظام إدارة التوزيع-1.0.0-Setup.exe"
```

### Check in Windows

1. Right-click the `.exe` file
2. Properties → Digital Signatures tab
3. Verify signature is present and valid

## Troubleshooting

### Error: "Certificate file not found"
- **Solution**: Check path to certificate file
- **Solution**: Use absolute path if relative path doesn't work

### Error: "Invalid certificate password"
- **Solution**: Verify password is correct
- **Solution**: Check for special characters in password

### Error: "Certificate expired"
- **Solution**: Renew or purchase new certificate
- **Solution**: Use timestamp server to extend validity

### Error: "Signing failed"
- **Solution**: Ensure certificate is valid
- **Solution**: Check certificate permissions
- **Solution**: Run build as administrator

## Best Practices

1. **Keep Certificate Secure**: Never commit certificate files to git
2. **Use Environment Variables**: Store passwords in environment variables
3. **Timestamp Server**: Always use timestamp server
4. **Test Signing**: Test signing process before production build
5. **Backup Certificate**: Keep secure backup of certificate and password

## CI/CD Integration

For automated builds, store certificate securely:

```yaml
# GitHub Actions example
env:
  CERTIFICATE_PASSWORD: ${{ secrets.CERTIFICATE_PASSWORD }}

steps:
  - name: Setup certificate
    run: |
      echo "${{ secrets.CERTIFICATE_BASE64 }}" | base64 -d > certificate.pfx
```

## Notes

- Self-signed certificates are fine for internal use
- Commercial certificates are required for public distribution
- Certificate must be valid at time of signing
- Timestamp server extends signature validity beyond certificate expiration
- Code signing adds ~5-10 seconds to build time

