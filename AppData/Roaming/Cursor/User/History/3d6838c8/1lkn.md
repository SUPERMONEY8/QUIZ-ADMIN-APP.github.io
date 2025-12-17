# كيفية تشغيل التطبيق

## المتطلبات
- .NET 8.0 SDK أو أحدث
- Visual Studio 2022 أو Visual Studio Code (مع C# extension)

## خطوات التشغيل

### الطريقة 1: استخدام Visual Studio
1. افتح ملف `SupplyChainManagement.csproj` في Visual Studio
2. اضغط `F5` أو انقر على زر "Start" لتشغيل التطبيق
3. سيتم إنشاء قاعدة البيانات تلقائياً عند أول تشغيل

### الطريقة 2: استخدام سطر الأوامر (Command Line)

#### في PowerShell أو Command Prompt:

```powershell
# الانتقال إلى مجلد المشروع
cd "C:\Users\LENOVO\Desktop\Dépo"

# استعادة الحزم (NuGet packages)
dotnet restore

# بناء المشروع
dotnet build

# تشغيل التطبيق
dotnet run
```

### الطريقة 3: استخدام Visual Studio Code
1. افتح مجلد المشروع في VS Code
2. اضغط `Ctrl+Shift+P` واكتب "Terminal: Create New Terminal"
3. في Terminal، نفذ الأوامر التالية:

```bash
dotnet restore
dotnet build
dotnet run
```

## ملاحظات مهمة

1. **قاعدة البيانات**: سيتم إنشاء ملف `SupplyChain.db` (SQLite) تلقائياً في نفس مجلد التطبيق عند أول تشغيل

2. **الأخطاء المحتملة**: 
   - إذا ظهر خطأ متعلق بـ NuGet packages، نفذ `dotnet restore`
   - إذا ظهر خطأ متعلق بالبناء، تأكد من تثبيت .NET 8.0 SDK

3. **التحقق من التثبيت**:
   ```bash
   dotnet --version
   ```
   يجب أن يظهر الإصدار 8.0 أو أحدث

## ما ستراه عند التشغيل

- نافذة التطبيق الرئيسية مع القائمة الجانبية بالعربية
- لوحة التحكم (Dashboard) كصفحة افتراضية
- جميع القوائم والنصوص بالعربية مع دعم RTL
- واجهة Fluent Design مع الثيم الداكن والألوان الزرقاء

## اختبار الوظائف

1. **المخزون**: انقر على "المخزون" ثم "إضافة منتج" لإضافة منتج جديد
2. **العملاء**: انقر على "العملاء" ثم "إضافة عميل"
3. **الموردون**: انقر على "الموردون" ثم "إضافة مورد"
4. **المبيعات**: عرض قائمة المبيعات
5. **المشتريات**: عرض قائمة المشتريات

## استكشاف الأخطاء

إذا واجهت مشاكل:

1. **خطأ في البناء**: 
   ```bash
   dotnet clean
   dotnet restore
   dotnet build
   ```

2. **مشكلة في قاعدة البيانات**: احذف ملف `SupplyChain.db` وأعد تشغيل التطبيق

3. **مشكلة في الحزم**: 
   ```bash
   dotnet nuget locals all --clear
   dotnet restore
   ```

