### 1. Content Security Policy (CSP - İçerik Güvenlik Politikası)
*   **Ne İşe Yarar:** Sadece güvenli olarak belirlediğimiz kaynaklardan (Google Fonts, FontAwesome gibi) veri yüklenmesini sağlar.
*   **Faydası:** Yabancı ve zararlı kodların (script) gizlice sitede çalışmasını engeller.

### 2. XSS Koruması (Cross-Site Scripting)
*   **Ne İşe Yarar:** Tarayıcının içerisinde bulunan güvenlik filtrelerini en yüksek seviyede aktif eder.
*   **Faydası:** Kötü niyetli kişilerin siteye dışarıdan yazı veya kod enjekte etmesini önler.

### 3. Referrer Policy (Yönlendirme Politikası)
*   **Ne İşe Yarar:** Siteden başka bir siteye tıklandığında (örn: LinkedIn), tarayıcının sizin sitenize dair hiçbir bilgi göndermemesini sağlar.
*   **Faydası:** Kullanıcının gizliliğini korur ve sitenizin yapısına dair verilerin dışarı sızmasını engeller.

### 4. Upgrade Insecure Requests (Eski İçerikleri Yükselt)
*   **Ne İşe Yarar:** Eğer sitede yanlışlıkla 'http' bağlantılı bir içerik kalırsa, tarayıcı bunu otomatik olarak en güvenli hal olan 'https' protokolüne çevirir.
*   **Faydası:** Sitedeki tüm bağlantıların her zaman şifreli ve güvenli olmasını garanti eder.
