# 🚀 Quick Email Setup (5 minutes)

## For Testing/Development (Easiest) - Mailtrap

1. **Go to**: https://mailtrap.io/ and sign up (free)
2. **Copy your credentials** from the inbox
3. **Add these lines to your `.env` file**:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=paste_your_mailtrap_username_here
MAIL_PASSWORD=paste_your_mailtrap_password_here
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@gorss.com
MAIL_FROM_NAME="GORSS"
```

4. **Clear config cache**:
```bash
php artisan config:clear
```

5. **Test it**:
```bash
php test_email.php
```

Done! ✅ Emails will appear in your Mailtrap inbox (not sent to real users).

---

## For Production - Gmail

1. **Enable 2-Step Verification** on Google Account
2. **Create App Password**: https://myaccount.google.com/apppasswords
   - Select "Mail" → "Other" → Name it "GORSS"
   - Copy the 16-character password
3. **Add to `.env`**:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=paste_16_char_app_password_here
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="GORSS"
```

4. **Clear cache and test**:
```bash
php artisan config:clear
php test_email.php
```

---

## Need Help?

- See `EMAIL_SETUP.md` for detailed instructions
- Check `storage/logs/laravel.log` for errors
- Run `php test_email.php` to test your setup

