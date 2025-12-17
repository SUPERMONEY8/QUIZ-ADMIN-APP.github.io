# Email Configuration Guide for GORSS

## Quick Setup Options

### Option 1: Mailtrap (Recommended for Development/Testing) 🧪

Mailtrap is perfect for testing - emails are caught and displayed in their dashboard instead of being sent to real users.

1. **Sign up for free at**: https://mailtrap.io/
2. **Get your credentials** from Mailtrap inbox settings
3. **Add to your `.env` file**:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@gorss.com
MAIL_FROM_NAME="GORSS"
```

### Option 2: Gmail SMTP (For Production) 📧

**Important**: You need to use an "App Password", not your regular Gmail password.

1. **Enable 2-Step Verification** on your Google Account
2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "GORSS" as the name
   - Copy the 16-character password
3. **Add to your `.env` file**:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-char-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="GORSS"
```

### Option 3: Other SMTP Providers

#### Outlook/Hotmail:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp-mail.outlook.com
MAIL_PORT=587
MAIL_USERNAME=your-email@outlook.com
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@outlook.com
MAIL_FROM_NAME="GORSS"
```

#### SendGrid:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your_sendgrid_api_key
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="GORSS"
```

#### Mailgun:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=your_mailgun_username
MAIL_PASSWORD=your_mailgun_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="GORSS"
```

### Option 4: Log Driver (Development Only - No Real Emails) 📝

For development when you don't need real emails, emails will be logged to `storage/logs/laravel.log`:

```env
MAIL_MAILER=log
MAIL_FROM_ADDRESS=noreply@gorss.com
MAIL_FROM_NAME="GORSS"
```

**Note**: With this option, emails won't actually be sent. Check the log file to see the email content.

## Testing Your Email Configuration

After setting up your email, test it by:

1. **Register a new user** - you should receive a verification email
2. **Check your inbox** (or Mailtrap dashboard if using Mailtrap)
3. **Verify the code** works correctly

## Troubleshooting

### Emails not sending?

1. **Check `.env` file** - Make sure all values are set correctly
2. **Clear config cache**: `php artisan config:clear`
3. **Check Laravel logs**: `storage/logs/laravel.log`
4. **Test connection**: Use the test script below

### Gmail "Less secure app" error?

- Use App Passwords (not your regular password)
- Make sure 2-Step Verification is enabled

### Port issues?

- Try port `465` with `MAIL_ENCRYPTION=ssl` instead of `587` with `tls`
- Check firewall settings

## Quick Test Script

Run this to test your email configuration:

```bash
php artisan tinker
```

Then in tinker:
```php
Mail::raw('Test email from GORSS', function ($message) {
    $message->to('your-test-email@example.com')
            ->subject('GORSS Email Test');
});
```

If successful, you should receive the test email!

