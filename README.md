# MobilAfet

**Afet bilgisi, raporlama ve bildirim akışları**

| Alan | Ayrıntı |
| --- | --- |
| Proje türü | Android uygulaması |
| Teknolojiler | Java · Android · Firebase · Retrofit |
| Geliştirici | Anıl Polat |

---

Afet bilgileri, kullanıcı bildirimleri ve tahliye ekranları içeren Android/Java projesi.

## Proje bağlamı

Üniversite eğitimi sırasında geliştirilen bir Android projesidir. Afet bilgilerini, harita/rota entegrasyonlarını ve bildirim akışlarını tek uygulamada ele alarak mobil geliştirme deneyimi kazanmak amacıyla hazırlanmıştır. Resmî bir afet veya acil durum hizmeti olarak sunulmaz.

### Servis entegrasyonları

Özgün API anahtarları ve kişisel bulut yapılandırmaları bu portföy sürümüne dahil değildir. Eski servis bağlantıları kullanım dışı bırakılmıştır. Entegrasyonları çalıştırmak için kendi Firebase/Appwrite projenizi ve ilgili API sağlayıcılarında kendi anahtarlarınızı oluşturup yerel yapılandırma üzerinden sağlamanız gerekir. Bu gereksinim, kişisel hesaplardan bağımsız ve yeniden kurulabilir bir örnek sunmak için bilinçli bir tercihtir.

## Özellikler

- Deprem listesi ve afet detay ekranları
- Hava durumu ve harita servisleri için entegrasyon kaynakları
- Afet raporlama, profil ve bildirim ekranları
- Tahliye/rota ekranları
- Firebase Authentication, Firestore ve Messaging kullanımı

## Teknolojiler

Java, Android SDK, Retrofit, Firebase, osmdroid. Kaynaktaki Android yapılandırması compile/target SDK 36 ve min SDK 26 kullanır.

## Yerel kurulum

1. Projeyi Android Studio ile açın; gerekli Android SDK ve Gradle sürümlerini kurun.
2. Kendi Firebase yapılandırmanızı `app/google-services.json` olarak yerel ekleyin. Bu dosya paylaşım kapsamı dışındadır.
3. `api.local.properties.example` dosyasını `api.local.properties` adıyla kopyalayıp kendi servis ayarlarınızı girin. Gerçek dosyayı commit etmeyin.
4. API sağlayıcılarının uygulama/paket, kota ve yetki sınırlamalarını kendi hesabınızda yapılandırın. APK içindeki istemci anahtarları çıkarılabilir; özel sunucu anahtarları istemcide tutulmamalıdır.

## İsteğe bağlı bildirim sunucusu

`backend/` klasöründeki Node.js servisi aşağıdaki çalışma modelini kullanır:

- Firebase ID token doğrulaması ve sunucu tarafından atanmış boolean `admin` yetkisi zorunludur.
- Bildirim gönderimi varsayılan olarak kapalıdır; sunucu varsayılan olarak yalnızca loopback adresine bağlanır.
- Firebase kimlik bilgileri Application Default Credentials ile dış ortamdan alınır; service-account JSON dosyası paylaşılmaz.
- Bildirim uç noktası kimliği doğrulanmış yönetici erişimi gerektirir.

```sh
cd backend
node --test auth.test.js
```

Testler kimlik doğrulama ara katmanını sahte bir doğrulayıcıyla çalıştırır; Firebase'e bağlanmaz ve bildirim göndermez. Sunucunun gerçek çalışması için bağımlılık kurulumu ve kendi Firebase ortamınız gerekir. `.env.example` bir örnektir; değerleri çalışma ortamına ayrıca sağlamalısınız.

Android istemcideki eski bildirim isteği yönetici doğrulamasını henüz sağlamaz. Normal kullanıcı raporlarını güvenilir sunucu olayları üzerinden bildirimlere dönüştürme akışı ayrıca tamamlanmalıdır. Bu kopya canlı yayına hazır değildir; Android derlemesi ve gerçek servis entegrasyonu çalıştırılmadı.
