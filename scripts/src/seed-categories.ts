import { db } from "@workspace/db";
import { businessCategoriesTable } from "@workspace/db";

const CATEGORIES = [
  { slug: "food-restaurants", name: "غذا و رستوران", sortOrder: 1, color: "#EA580C", description: "رستوران‌ها، کافه‌ها، شیرینی‌فروشی‌ها و نانوایی‌های محلی" },
  { slug: "shopping", name: "خرید و بازار", sortOrder: 2, color: "#0D9488", description: "سوپرمارکت، مراکز خرید، بازارهای محلی و کالای عمده" },
  { slug: "fashion", name: "پوشاک و مد", sortOrder: 3, color: "#7C3AED", description: "لباس، کفش، اکسسوری و پوشاک محلی و سنتی" },
  { slug: "beauty", name: "زیبایی و آرایش", sortOrder: 4, color: "#DB2777", description: "آرایشگاه، سالن زیبایی، کلینیک و لوازم آرایشی" },
  { slug: "home-living", name: "خانه و زندگی", sortOrder: 5, color: "#059669", description: "مبلمان، دکوراسیون، لوازم خانگی و گیاهان" },
  { slug: "health-medical", name: "سلامت و پزشکی", sortOrder: 6, color: "#0369A1", description: "کلینیک، داروخانه، دندانپزشکی و خدمات درمانی" },
  { slug: "automotive", name: "خودرو و موتور", sortOrder: 7, color: "#92400E", description: "تعمیرگاه، لوازم یدکی، کارواش و خدمات خودرویی" },
  { slug: "education", name: "آموزش و مهارت", sortOrder: 8, color: "#1D4ED8", description: "آموزشگاه، تدریس خصوصی، کلاس‌های هنری و مهارتی" },
  { slug: "tourism-leisure", name: "گردشگری و تفریح", sortOrder: 9, color: "#047857", description: "اقامتگاه، ویلا، سفر و تورگردانی شمال" },
  { slug: "agriculture", name: "کشاورزی و محصولات بومی", sortOrder: 10, color: "#65A30D", description: "محصولات بومی، ارگانیک، دامپروری و باغداری" },
  { slug: "construction", name: "ساختمان و مسکن", sortOrder: 11, color: "#78716C", description: "مصالح، پیمانکاری، طراحی داخلی و نما" },
  { slug: "tech-services", name: "فناوری و خدمات", sortOrder: 12, color: "#6366F1", description: "تعمیر موبایل، کامپیوتر، برق و خدمات دیجیتال" },
  { slug: "crafts-artisan", name: "صنایع دستی و هنر", sortOrder: 13, color: "#D97706", description: "سفالگری، بافندگی، نقاشی و هنرهای سنتی" },
  { slug: "professional-services", name: "خدمات حرفه‌ای", sortOrder: 14, color: "#0F766E", description: "وکیل، حسابدار، مشاور و خدمات اداری" },
  { slug: "pets", name: "حیوانات خانگی", sortOrder: 15, color: "#B45309", description: "دامپزشکی، آرایشگاه حیوانات، فروش و نگهداری" },
];

async function seedCategories() {
  console.log("Seeding business categories...");

  for (const cat of CATEGORIES) {
    await db
      .insert(businessCategoriesTable)
      .values({
        slug: cat.slug,
        name: cat.name,
        sortOrder: cat.sortOrder,
        color: cat.color,
        description: cat.description,
        parentId: null,
      })
      .onConflictDoUpdate({
        target: businessCategoriesTable.slug,
        set: {
          name: cat.name,
          sortOrder: cat.sortOrder,
          color: cat.color,
          description: cat.description,
        },
      });
    console.log(`  ✓ ${cat.name}`);
  }

  console.log(`Done. Seeded ${CATEGORIES.length} categories.`);
  process.exit(0);
}

seedCategories().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
