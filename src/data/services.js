import networkImage from "../assets/network-service.jpg";
import networkSupportImage from "../assets/network-support-service.jpg";
import activeNetworkImage from "../assets/active-network-service.jpg";
import passiveNetworkImage from "../assets/passive-network-service.jpg";
import serverVirtualizationImage from "../assets/server-virtualization-service.jpg";
import networkSecurityImage from "../assets/network-security-service.jpg";
import backupImage from "../assets/backup-service.png";
import voipImage from "../assets/voip-service.png";
import webImage from "../assets/website-design-service.jpg";
import softwareImage from "../assets/software-development-service.jpg";

export const services = [
  {
    slug: "network",
    icon: "bi-diagram-3",
    title: "طراحی و اجرای شبکه",
    image: networkImage,
    imagePosition: "center",
    description:
      "در این بخش، نیازهای مجموعه بررسی شده و ساختار شبکه متناسب با تعداد کاربران، تجهیزات، فضای کاری و نیازهای آینده طراحی و پیاده‌سازی می‌شود.",
    intro:
      "طراحی و اجرای اصولی شبکه، پایه ایجاد یک زیرساخت پایدار، امن و قابل توسعه برای سازمان است.",
    items: [
      "بررسی و تحلیل نیازهای شبکه",
      "طراحی ساختار و توپولوژی شبکه",
      "نصب و راه‌اندازی تجهیزات شبکه",
      "راه‌اندازی ارتباط بین سیستم‌ها و تجهیزات",
      "تست و بررسی عملکرد زیرساخت"
    ]
  },

  {
    slug: "network-support",
    icon: "bi-headset",
    title: "پشتیبانی شبکه و IT",
    image: networkSupportImage,
    imagePosition: "center",
    description:
      "خدمات پشتیبانی شامل بررسی، نگهداری و عیب‌یابی شبکه، تجهیزات و سیستم‌های مورد استفاده سازمان است.",
    intro:
      "پشتیبانی مستمر شبکه به کاهش اختلالات و حفظ عملکرد پایدار زیرساخت فناوری اطلاعات کمک می‌کند.",
    items: [
      "بررسی و عیب‌یابی مشکلات شبکه",
      "پشتیبانی تجهیزات شبکه",
      "بررسی وضعیت سیستم‌ها",
      "پشتیبانی کاربران",
      "نگهداری دوره‌ای زیرساخت"
    ]
  },

  {
    slug: "active-network",
    icon: "bi-hdd-network",
    title: "خدمات اکتیو شبکه",
    image: activeNetworkImage,
    imagePosition: "center",
    description:
      "خدمات اکتیو شامل راه‌اندازی، تنظیم و مدیریت تجهیزات و سرویس‌هایی است که وظیفه پردازش و انتقال اطلاعات را در شبکه بر عهده دارند.",
    intro:
      "راه‌اندازی و پیکربندی تجهیزات و سرویس‌های فعال شبکه، نقش مهمی در عملکرد و مدیریت زیرساخت سازمان دارد.",
    items: [
      "راه‌اندازی و پیکربندی سرور",
      "پیکربندی روتر و سوئیچ",
      "راه‌اندازی سرویس‌های شبکه",
      "مدیریت کاربران و دسترسی‌ها",
      "بهینه‌سازی عملکرد شبکه"
    ]
  },

  {
    slug: "passive-network",
    icon: "bi-ethernet",
    title: "خدمات پسیو شبکه",
    image: passiveNetworkImage,
    imagePosition: "center",
    description:
      "خدمات پسیو شامل طراحی و اجرای بستر فیزیکی شبکه، کابل‌کشی و نصب تجهیزات مورد نیاز برای ایجاد ارتباط بین بخش‌های مختلف سازمان است.",
    intro:
      "اجرای استاندارد زیرساخت فیزیکی، پایه ایجاد یک شبکه پایدار و قابل توسعه است.",
    items: [
      "کابل‌کشی ساخت‌یافته شبکه",
      "نصب و آرایش رک",
      "نصب پریز و تجهیزات شبکه",
      "اجرای ترانک و مسیر کابل",
      "تست ارتباطات شبکه"
    ]
  },

  {
    slug: "server-virtualization",
    icon: "bi-server",
    title: "سرور و مجازی‌سازی",
    image: serverVirtualizationImage,
    imagePosition: "center",
    description:
      "با استفاده از راهکارهای مناسب سرور و مجازی‌سازی می‌توان منابع سخت‌افزاری را بهتر مدیریت کرد و زیرساختی منعطف‌تر ایجاد کرد.",
    intro:
      "راهکارهای سرور و مجازی‌سازی امکان مدیریت بهتر منابع و توسعه انعطاف‌پذیر زیرساخت را فراهم می‌کنند.",
    items: [
      "راه‌اندازی سرورهای فیزیکی",
      "پیاده‌سازی مجازی‌سازی",
      "ایجاد و مدیریت ماشین‌های مجازی",
      "راه‌اندازی سرویس‌های سرور",
      "مدیریت و نگهداری زیرساخت سرور"
    ]
  },

  {
    slug: "network-security",
    icon: "bi-shield-check",
    title: "امنیت شبکه",
    image: networkSecurityImage,
    imagePosition: "center",
    description:
      "راهکارهای امنیت شبکه با هدف کاهش دسترسی‌های غیرمجاز و افزایش حفاظت از سیستم‌ها و اطلاعات سازمان اجرا می‌شوند.",
    intro:
      "حفاظت از اطلاعات و منابع سازمان نیازمند طراحی و مدیریت صحیح امنیت زیرساخت شبکه است.",
    items: [
      "بررسی وضعیت امنیت شبکه",
      "مدیریت دسترسی کاربران",
      "امن‌سازی تجهیزات شبکه",
      "راهکارهای آنتی‌ویروس",
      "بررسی آسیب‌پذیری‌های زیرساخت"
    ]
  },

  {
    slug: "backup",
    icon: "bi-cloud-arrow-up",
    title: "پشتیبان‌گیری و بازیابی اطلاعات",
    image: backupImage,
    imagePosition: "center",
    description:
      "راهکارهای پشتیبان‌گیری بر اساس نوع اطلاعات و نیاز سازمان طراحی می‌شوند تا امکان نگهداری و بازیابی داده‌های ضروری فراهم شود.",
    intro:
      "وجود نسخه پشتیبان مناسب می‌تواند ریسک از دست رفتن اطلاعات مهم سازمان را کاهش دهد.",
    items: [
      "بررسی نیازهای پشتیبان‌گیری",
      "طراحی ساختار Backup",
      "پشتیبان‌گیری دوره‌ای",
      "نگهداری نسخه‌های پشتیبان",
      "بازیابی اطلاعات"
    ]
  },

  {
    slug: "voip",
    icon: "bi-telephone",
    title: "ارتباطات سازمانی و VoIP",
    image: voipImage,
    imagePosition: "center",
    description:
      "راهکارهای VoIP با استفاده از زیرساخت شبکه، امکان ایجاد سیستم ارتباطی یکپارچه و قابل مدیریت را برای سازمان فراهم می‌کنند.",
    intro:
      "سیستم‌های ارتباطی تحت شبکه امکان مدیریت بهتر ارتباطات داخلی و خارجی سازمان را فراهم می‌کنند.",
    items: [
      "راه‌اندازی سیستم VoIP",
      "راه‌اندازی تلفن‌های تحت شبکه",
      "تعریف داخلی‌ها و کاربران",
      "تنظیم ارتباطات سازمانی",
      "راهکارهای دسترسی و ارتباط از راه دور"
    ]
  },

  {
    slug: "website-design",
    icon: "bi-code-slash",
    title: "طراحی سایت",
    image: webImage,
    description:
      "طراحی و پیاده‌سازی وب‌سایت متناسب با نیازها و اهداف کسب‌وکار.",
    intro:
      "راهکارهای طراحی سایت برای ایجاد حضور حرفه‌ای و متناسب با نیازهای کسب‌وکار ارائه می‌شوند.",
    items: [
      "طراحی رابط کاربری",
      "توسعه وب‌سایت",
      "طراحی سایت واکنش‌گرا"
    ]
  },

  {
    slug: "software-development",
    icon: "bi-window-stack",
    title: "تولید نرم‌افزار",
    image:softwareImage,
    description:
      "طراحی و توسعه نرم‌افزارهای اختصاصی متناسب با نیازهای سازمان.",
    intro:
      "نرم‌افزارهای اختصاصی می‌توانند متناسب با نیازها و فرایندهای هر سازمان طراحی و توسعه داده شوند.",
    items: [
      "تحلیل و طراحی نرم‌افزار",
      "توسعه نرم‌افزار اختصاصی",
      "پشتیبانی و توسعه نرم‌افزار"
    ]
  }
];