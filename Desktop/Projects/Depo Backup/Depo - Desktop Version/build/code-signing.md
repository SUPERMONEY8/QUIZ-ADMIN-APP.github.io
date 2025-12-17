# Code Signing Guide

Code signing is optional but **highly recommended** for production releases. It prevents Windows from showing security warnings when users install your application.

## Why Code Sign?

- ✅ **No Security Warnings**: Windows won't show "Unknown Publisher" warnings
- ✅ **User Trust**: Users are more likely to install signed applications
- ✅ **Professional**: Shows you're a legitimate software publisher
- ✅ **Auto-Updates**: Required for some auto-update mechanisms

## Options

### Option 1: Purchase Code Signing Certificate (Recommended for Production)

1. **Purchase from a Certificate Authority**:
   - [DigiCert](https://www.digicert.com/) - $200-400/year
   - [Sectigo](https://sectigo.com/) - $200-300/year
   - [GlobalSign](https://www.globalsign.com/) - $200-400/year
   - [SSL.com](https://www.ssl.com/) - $200-300/year

2. **Certificate Types**:
   - **OV (Organization Validated)**: Basic validation, ~$200/year
   - **EV (Extended Validation)**: Highest trust, ~$400/year (recommended)

3. **After Purchase**:
   - Download the certificate file (`.pfx` or `.p12`)
   - Note the certificate password

### Option 2: Self-Signed Certificate (Testing Only)

**Warning**: Self-signed certificates will still show warnings. Only use for testing.

```bash
# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Convert to PFX format
openssl pkcs12 -export -out certificate.pfx -inkey key.pem -in cert.pem
```

## Configuration

### Method 1: Environment Variables (Recommended)

Set these environment variables before building:

```bash
# Windows (Command Prompt)
set CSC_LINK=path\to\certificate.pfx
set CSC_KEY_PASSWORD=your-certificate-password

# Windows (PowerShell)
$env:CSC_LINK="path\to\certificate.pfx"
$env:CSC_KEY_PASSWORD="your-certificate-password"

# Then build
bun run dist
```

### Method 2: package.json Configuration

Add to `package.json`:

```json
{
  "build": {
    "win": {
      "certificateFile": "path/to/certificate.pfx",
      "certificatePassword": "your-password",
      "signingHashAlgorithms": ["sha256"],
      "sign": "path/to/signtool.exe"
    }
  }
}
```

**Note**: Don't commit passwords to git! Use environment variables instead.

### Method 3: Windows Certificate Store

If certificate is installed in Windows Certificate Store:

```bash
# List certificates
certmgr.msc

# Use certificate thumbprint
set CSC_LINK=thumbprint:YOUR_CERTIFICATE_THUMBPRINT
set CSC_KEY_PASSWORD=your-password
```

## Signing Process

1. **Set environment variables** (if using Method 1)
2. **Build the application**:
   ```bash
   bun run dist
   ```
3. **Electron Builder will automatically sign**:
   - The main executable
   - The installer
   - All DLLs (if any)

## Verification

After building, verify the signature:

```bash
# Check executable signature
signtool verify /pa "dist\win-unpacked\Depo.exe"

# Check installer signature
signtool verify /pa "dist\Depo-1.0.0-Setup.exe"
```

Or use PowerShell:

```powershell
Get-AuthenticodeSignature "dist\win-unpacked\Depo.exe"
Get-AuthenticodeSignature "dist\Depo-1.0.0-Setup.exe"
```

## Troubleshooting

### "SignTool Error: No certificates were found"

- Check certificate path is correct
- Verify certificate password
- Ensure certificate is valid (not expired)

### "SignTool Error: The specified timestamp server either could not be reached"

- This is a warning, not an error
- The app will still be signed
- To fix, configure timestamp server in `package.json`:

```json
{
  "build": {
    "win": {
      "signingHashAlgorithms": ["sha256"],
      "signDlls": true,
      "timeStampServer": "http://timestamp.digicert.com"
    }
  }
}
```

### "Certificate is not valid for code signing"

- Ensure certificate has code signing capability
- Check certificate is not expired
- Verify certificate is in correct format (PFX/P12)

## Timestamp Servers

Recommended timestamp servers:

- **DigiCert**: `http://timestamp.digicert.com`
- **Sectigo**: `http://timestamp.sectigo.com`
- **GlobalSign**: `http://timestamp.globalsign.com`
- **Microsoft**: `http://timestamp.verisign.com/scripts/timstamp.dll`

## Best Practices

1. **Never commit certificates to git**
2. **Use environment variables for passwords**
3. **Store certificates securely**
4. **Set up CI/CD signing** (for automated builds)
5. **Test signing on clean machine** before production
6. **Keep certificates backed up**
7. **Renew certificates before expiration**

## CI/CD Integration

For automated builds, set environment variables in your CI/CD system:

### GitHub Actions

```yaml
env:
  CSC_LINK: ${{ secrets.CSC_LINK }}
  CSC_KEY_PASSWORD: ${{ secrets.CSC_KEY_PASSWORD }}
```

### GitLab CI

```yaml
variables:
  CSC_LINK: "$CI_PROJECT_DIR/certificate.pfx"
  CSC_KEY_PASSWORD: "$CSC_KEY_PASSWORD"
```

## Cost Considerations

- **OV Certificate**: $200-300/year (good for most apps)
- **EV Certificate**: $400-500/year (highest trust, recommended for commercial apps)
- **Self-Signed**: Free (testing only, shows warnings)

## Resources

- [Electron Builder Code Signing](https://www.electron.build/code-signing)
- [Windows Code Signing Guide](https://docs.microsoft.com/en-us/windows/win32/seccrypto/cryptography-tools)
- [Certificate Authority Comparison](https://www.sslshopper.com/code-signing-certificates.html)

