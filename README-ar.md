# أثر — متحف الفنون

الكود الكامل للمتحف: HTML + CSS + JavaScript + Three.js.

## التشغيل
1. فكّي ضغط الملف.
2. افتحي مجلد athar-museum في VS Code.
3. شغّلي index.html عبر إضافة Live Server.

بديل عند توفر Python: افتحي الطرفية داخل مجلد athar-museum ونفّذي:

    python -m http.server 8000 --bind 127.0.0.1

ثم افتحي http://localhost:8000 في المتصفح. للإيقاف: Ctrl+C.

مهم: شغّلي الصفحة بخادم محلي، لأن فتحها بالنقر المزدوج عبر file:// قد يمنع تحميل وحدات JavaScript.

## الملفات
- index.html: بنية الصفحة.
- style.css: الألوان والخطوط والتصميم المتجاوب.
- app.js: معلومات اللوحات، القاعة ثلاثية الأبعاد، الإضاءة وحركة الكاميرا.
- assets/: الصور ومكتبة Three.js المحلية.

## التعديل
عدّلي المصفوفة works في بداية app.js لتغيير أسماء الأعمال ووصفها وصورها.
لتغيير التصميم والألوان عدّلي style.css.

## الاستخدام
الأسهم أو السحب: الانتقال بين اللوحات.
النقر على اللوحة أو زر الاقتراب: تقريب العرض.
Escape: العودة من العرض المقرّب.

الصور ومكتبة العرض مضمّنة. الخطوط تُحمّل من Google Fonts عند توفر الإنترنت، وتُستخدم خطوط بديلة عند عدم توفره.
العرض ثلاثي الأبعاد يحتاج متصفحًا يدعم WebGL. يتوفر عرض صورة بديل إذا تعذّر إنشاء العرض الثلاثي.

## مصادر الأعمال والصور
الفتاة ذات القرط اللؤلؤي — يوهانس فيرمير:
https://www.mauritshuis.nl/en/our-collection/artworks/670-girl-with-a-pearl-earring/
الصورة: https://primary.jwwb.nl/public/o/r/z/temp-ojfttwkysgeidowvbqho/1665_girl_with_a_pearl_earring-high.jpg

ليلة النجوم — فنسنت فان غوخ:
https://www.moma.org/collection/works/79802
الصورة: https://cdn.sanity.io/images/dqllnil6/production/33462adf3f0e4a4753bcbd650f2449e4eac721eb-960x760.jpg

القُبلة — غوستاف كليمت:
https://en.wikipedia.org/wiki/The_Kiss_(Klimt)
الصورة: https://atsunnyside.blog/wp-content/uploads/2018/03/1920px-the_kiss_-_gustav_klimt_-_google_cultural_institute3-e1524487242910.jpg

Three.js v0.169.0 — MIT license، مرفق في THREE-LICENSE.txt.
