export const categories = [
    { id: 1, name: "Fresh Vegetables", slug: "vegetables", count: 48, badge: "Fresh", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop" },
    { id: 2, name: "Fresh Fruits", slug: "fruits", count: 36, badge: "Seasonal", image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=400&fit=crop" },
    { id: 3, name: "Rice & Grains", slug: "grains", count: 24, badge: "Dry Food", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop" },
    { id: 4, name: "Cooking Oils", slug: "oils", count: 18, badge: "Premium", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop" },
    { id: 5, name: "Legumes & Beans", slug: "legumes", count: 32, badge: "Protein-rich", image: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=400&h=400&fit=crop" },
    { id: 6, name: "Flours & Cereals", slug: "flours", count: 20, badge: "Staple", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop" },
    { id: 7, name: "Spices & Herbs", slug: "spices", count: 55, badge: "Aromatic", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop" },
    { id: 8, name: "Dairy & Eggs", slug: "dairy", count: 22, badge: "Fresh", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop" },
    { id: 9, name: "Pastas & Noodles", slug: "pasta", count: 15, badge: "Import", image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&h=400&fit=crop" },
    { id: 10, name: "Sugar & Sweeteners", slug: "sugar", count: 14, badge: "-20%", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop" }
];

export const products = [
    // Vegetables
    {
        id: 1, name: "Fresh Organic Tomatoes", category: "vegetables", unit: "Per 1 kg",
        price: 2500, originalPrice: 3200, discount: 22, rating: 4.8, reviews: 324,
        image: "https://images.unsplash.com/photo-1546094096-0df4bcafd6fd?w=400&h=400&fit=crop",
        description: "Farm-fresh organic tomatoes hand-picked daily from local Ugandan farms. Plump, juicy and full of flavour. Rich in lycopene and Vitamin C. Perfect for stews, sauces, salads, and soups. No pesticides used — 100% natural.",
        stock: 50, badge: "Organic"
    },
    {
        id: 2, name: "Green Spinach Bundle", category: "vegetables", unit: "1 Bundle (~500g)",
        price: 1500, originalPrice: 2000, discount: 25, rating: 4.7, reviews: 198,
        image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop",
        description: "Crispy, dark-green spinach bundle freshly harvested from fertile Ugandan gardens. Packed with iron, calcium and folate. Excellent for stews, groundnut sauce, sautés, and healthy smoothies. Washed and ready to cook.",
        stock: 30, badge: "Fresh"
    },
    {
        id: 3, name: "Purple Cabbage (Head)", category: "vegetables", unit: "Per piece (~1.2kg)",
        price: 3000, originalPrice: 3800, discount: 21, rating: 4.5, reviews: 87,
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=400&fit=crop",
        description: "Vibrant purple cabbage bursting with antioxidants and Vitamin C. Crisp texture and mild flavour. Great for coleslaw, salads, stir-fries and mukene dishes. Keeps fresh for up to 2 weeks when refrigerated.",
        stock: 40, badge: "Antioxidant"
    },
    {
        id: 4, name: "Red Onions", category: "vegetables", unit: "Per 2 kg",
        price: 5000, originalPrice: 6500, discount: 23, rating: 4.9, reviews: 512,
        image: "https://images.unsplash.com/photo-1589419424524-0424ccd98e43?w=400&h=400&fit=crop",
        description: "Strong, full-flavoured Ugandan red onions sourced directly from Kasese and Kabale highlands. Long shelf life when stored in a cool dry place. A kitchen essential for katogo, stews, rolex and any Ugandan dish.",
        stock: 100, badge: "Best Seller"
    },
    {
        id: 5, name: "Irish Potatoes (Bag)", category: "vegetables", unit: "5 kg bag",
        price: 12000, originalPrice: 15000, discount: 20, rating: 4.8, reviews: 410,
        image: "https://images.unsplash.com/photo-1518977957600-1c2892fe4a08?w=400&h=400&fit=crop",
        description: "Premium Irish potatoes from the fertile hills of Kabale — Uganda's potato capital. Clean, firm and starchy. Perfect for chips, boiling, roasting or mashing. High starch content guarantees fluffy, satisfying results every time.",
        stock: 60, badge: "Value Pack"
    },
    {
        id: 6, name: "Garlic Bulbs", category: "vegetables", unit: "250g pack",
        price: 4000, originalPrice: 5500, discount: 27, rating: 4.9, reviews: 284,
        image: "https://images.unsplash.com/photo-1540148124736-1b69f7940d95?w=400&h=400&fit=crop",
        description: "Aromatic whole garlic bulbs with firm, papery skins. Strong pungent flavour essential for Ugandan cooking — groundnut stew, beans, meat dishes and marinades. Known for powerful natural antibacterial and immune-boosting properties.",
        stock: 80, badge: "Immunity"
    },
    {
        id: 7, name: "Sweet Mangoes (Kg)", category: "fruits", unit: "Per 1 kg (3–4 pcs)",
        price: 3000, originalPrice: 4000, discount: 25, rating: 4.9, reviews: 631,
        image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop",
        description: "Juicy, golden-flesh mangoes sourced from Soroti and Mbale, Uganda's mango heartlands. Naturally tree-ripened for maximum sweetness. No fibres, smooth texture. Rich in Vitamins A and C. Great eaten fresh, blended or used in desserts.",
        stock: 45, badge: "Seasonal"
    },
    {
        id: 8, name: "Banana Bunch (Matooke)", category: "fruits", unit: "1 bunch (~2kg)",
        price: 6000, originalPrice: 8000, discount: 25, rating: 4.7, reviews: 452,
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
        description: "Fresh green matooke — Uganda's most beloved staple food. Harvested fresh from Buganda, Kasese and Mbarara farms. Steam for rich, starchy plates of matoke best served with groundnut stew, beef or smoked fish. A household must-have.",
        stock: 50, badge: "Staple"
    },
    {
        id: 9, name: "Watermelon (Whole)", category: "fruits", unit: "Per piece (~4–5kg)",
        price: 15000, originalPrice: 20000, discount: 25, rating: 4.8, reviews: 317,
        image: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=400&h=400&fit=crop",
        description: "Extra-large, super-sweet watermelons grown in Karamoja and Luwero. Deep red flesh, extremely juicy with a high water content — perfect for Uganda's hot climate. Great for refreshing drinks, fruit salads and kids' snacks.",
        stock: 25, badge: "Summer Hit"
    },
    {
        id: 10, name: "Avocados (Hass)", category: "fruits", unit: "Pack of 3 pcs",
        price: 4000, originalPrice: 5500, discount: 27, rating: 4.9, reviews: 523,
        image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop",
        description: "Creamy, buttery Hass avocados from Mbarara and Masaka. Rich in healthy monounsaturated fats, potassium and Vitamin E. Perfectly ripe — ready to eat. Delicious on bread, in salads, or eaten plain with a little salt.",
        stock: 35, badge: "Heart Healthy"
    },
    // Rice & Grains
    {
        id: 11, name: "Pishori Long Grain Rice", category: "grains", unit: "2 kg pack",
        price: 12000, originalPrice: 15000, discount: 20, rating: 4.9, reviews: 789,
        image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop",
        description: "Premium aromatic long-grain Pishori rice — the most popular rice variety in East Africa. Naturally fragrant, fluffy and non-sticky when cooked. Ideal for pilau, fried rice and plain steamed rice. Sorted, cleaned and stone-free.",
        stock: 200, badge: "Premium"
    },
    {
        id: 12, name: "Broken Wheat (Uji)", category: "grains", unit: "1 kg pack",
        price: 4000, originalPrice: 5500, discount: 27, rating: 4.6, reviews: 234,
        image: "https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=400&h=400&fit=crop",
        description: "Whole-grain broken wheat (sembe), rich in dietary fibre, iron and B vitamins. Quick to cook and very nourishing. Makes excellent uji porridge for children and adults. Also used for nutritious ugali and experimental breads.",
        stock: 150, badge: "Wholegrain"
    },
    {
        id: 13, name: "Millet (Wimbi) Grain", category: "grains", unit: "500g pack",
        price: 3500, originalPrice: 4500, discount: 22, rating: 4.7, reviews: 167,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
        description: "Finger millet (wimbi) — an ancient East African superfood grain. Gluten-free, extremely high in calcium, iron and amino acids. Ideal for nutritious uji porridge, obushera (millet drink) or supplementing ugali. A Ugandan tradition.",
        stock: 120, badge: "Superfood"
    },
    // Oils
    {
        id: 14, name: "Pure Sunflower Oil", category: "oils", unit: "2-litre bottle",
        price: 18000, originalPrice: 22000, discount: 18, rating: 4.8, reviews: 643,
        image: "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=400&h=400&fit=crop",
        description: "100% pure refined sunflower oil — Uganda's most widely used cooking oil. Cholesterol-free with a high smoke point, making it perfect for deep frying chips, cooking beans, frying fish, sautéing vegetables and baking. Light, neutral flavour that does not overpower your food. Certified and quality-tested.",
        stock: 180, badge: "Popular"
    },
    {
        id: 15, name: "Extra Virgin Olive Oil", category: "oils", unit: "500ml bottle",
        price: 35000, originalPrice: 45000, discount: 22, rating: 4.9, reviews: 321,
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop",
        description: "Premium cold-pressed extra virgin olive oil made from first-press olives. Deep golden colour with a rich, fruity aroma. Loaded with Omega-9 fatty acids and powerful antioxidants. Best used as a salad dressing, dipping oil or drizzled over pasta and grilled meats. Not ideal for high-heat frying — preserves nutrients best unheated.",
        stock: 60, badge: "Imported"
    },
    {
        id: 29, name: "Nia Sunflower Oil", category: "oils", unit: "1-litre bottle",
        price: 10000, originalPrice: 13000, discount: 23, rating: 4.7, reviews: 412,
        image: "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=400&h=400&fit=crop",
        description: "Nia 100% pure sunflower oil in a convenient 1-litre bottle. A household favourite in Uganda for everyday cooking. Light on flavour, rich in Vitamin E and polyunsaturated fats. Suitable for frying, stewing, baking and making sauces. Affordable, quality oil for daily use.",
        stock: 250, badge: "Value"
    },
    {
        id: 30, name: "Palm Oil (Omukwano)", category: "oils", unit: "1-litre bottle",
        price: 9000, originalPrice: 12000, discount: 25, rating: 4.6, reviews: 289,
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop",
        description: "Traditional red palm oil (omukwano) — deep orange-red colour from naturally occurring beta-carotene. Distinctive earthy flavour popular in Ugandan groundnut stew, beans and local sauces. Rich in tocotrienols and Vitamin A. Adds colour and authentic taste to traditional dishes.",
        stock: 150, badge: "Traditional"
    },
    // Legumes
    {
        id: 16, name: "Green Grams (Ndengu)", category: "legumes", unit: "500g pack",
        price: 4500, originalPrice: 6000, discount: 25, rating: 4.8, reviews: 298,
        image: "https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400&h=400&fit=crop",
        description: "Whole green grams — one of Uganda's most nutritious and affordable legumes. Quick-cooking, creamy texture and mild earthy flavour. Excellent source of plant protein and dietary fibre. Great for thick stews, soups or mixed with rice. Also popular for sprouting as a healthy snack.",
        stock: 250, badge: "High Protein"
    },
    {
        id: 17, name: "Red Kidney Beans", category: "legumes", unit: "1 kg pack",
        price: 7000, originalPrice: 9000, discount: 22, rating: 4.7, reviews: 213,
        image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop",
        description: "Premium Ugandan-grown red kidney beans — sorted, cleaned and ready to cook. High in plant-based protein, folate and potassium. Popular for beans and rice, chilli dishes and hearty soups. Soak overnight for best results — produces a thick, rich gravy. A daily protein staple for Ugandan families.",
        stock: 200, badge: "Protein Rich"
    },
    {
        id: 18, name: "Yellow Lentils (Dhal)", category: "legumes", unit: "500g pack",
        price: 5000, originalPrice: 6500, discount: 23, rating: 4.8, reviews: 187,
        image: "https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&h=400&fit=crop",
        description: "Split yellow lentils — the fastest-cooking legume, ready in under 20 minutes without soaking. Naturally creamy texture with a mild earthy flavour. Packed with protein, iron and folate. Perfect for dhal curry (popular in Kampala), thick soups and nutritious baby food.",
        stock: 220, badge: "Quick Cook"
    },
    // Flours
    {
        id: 19, name: "Posho (Maize Flour)", category: "flours", unit: "2 kg pack",
        price: 6000, originalPrice: 8000, discount: 25, rating: 4.9, reviews: 1023,
        image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop",
        description: "Finely milled white maize flour — Uganda's most essential food staple (posho). Fortified with Vitamin A, Iron and Zinc for added nutrition. Produces a smooth, firm consistency for perfect posho every time. Used in schools, homes and restaurants across Uganda. Also great for making mandazi and porridge.",
        stock: 500, badge: "Staple"
    },
    {
        id: 20, name: "Wheat Flour (All Purpose)", category: "flours", unit: "1 kg pack",
        price: 4000, originalPrice: 5500, discount: 27, rating: 4.7, reviews: 432,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
        description: "Finely sifted, enriched all-purpose wheat flour suitable for chapati, mandazi, bread, cakes and pancakes. Made from quality wheat grains and milled to a fine, silky texture. Rises consistently well for baked goods. A staple in Ugandan households for breakfast mandazi and rolex chapati.",
        stock: 300, badge: "Multi-Use"
    },
    // Spices
    {
        id: 21, name: "Pilau Masala Spice Mix", category: "spices", unit: "100g pack",
        price: 4500, originalPrice: 6000, discount: 25, rating: 4.9, reviews: 867,
        image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop",
        description: "Authentic East African pilau masala — a finely ground blend of cinnamon, cloves, cumin, cardamom and black pepper. Gives rice dishes and meat a rich, warm, aromatic depth of flavour. Popular across Uganda for pilau rice, nyama choma marinade and biryani.",
        stock: 200, badge: "Authentic"
    },
    {
        id: 22, name: "Whole Black Pepper", category: "spices", unit: "50g pack",
        price: 5000, originalPrice: 7000, discount: 29, rating: 4.8, reviews: 312,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
        description: "Premium whole black peppercorns with a bold, intense aroma. Sun-dried for maximum flavour retention. Use in a grinder for freshly cracked pepper over meats, soups and salads. Superior freshness compared to pre-ground pepper. A must-have for any serious kitchen.",
        stock: 150, badge: "Bold Flavour"
    },
    // Dairy
    {
        id: 23, name: "Fresh Farm Eggs (Tray)", category: "dairy", unit: "Tray of 30 eggs",
        price: 18000, originalPrice: 22000, discount: 18, rating: 4.9, reviews: 1243,
        image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop",
        description: "Free-range farm eggs from grain-fed Ugandan hens. Rich orange yolk — a sign of premium freshness and quality. Collected daily from local farms in Wakiso and Mukono. High in protein, Omega-3 and healthy fats. Perfect for frying, boiling, baking and making omelettes.",
        stock: 100, badge: "Free Range"
    },
    {
        id: 24, name: "Fresh Full Cream Milk", category: "dairy", unit: "1-litre packet",
        price: 4000, originalPrice: 5000, discount: 20, rating: 4.8, reviews: 534,
        image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop",
        description: "Fresh full-cream milk pasteurised for safety. Creamy, rich taste with full natural fat content. Sourced from Ankole long-horned cattle — famous for producing Uganda's richest milk. High in calcium, Vitamin D and protein. Ideal for tea, porridge, baking or drinking cold.",
        stock: 200, badge: "Farm Fresh"
    },
    // Pasta
    {
        id: 25, name: "Spaghetti Pasta (500g)", category: "pasta", unit: "500g pack",
        price: 5500, originalPrice: 7000, discount: 21, rating: 4.7, reviews: 289,
        image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&h=400&fit=crop",
        description: "Premium durum wheat spaghetti — imported for a perfect al dente texture. Enriched with B vitamins. Cooks in 8–10 minutes. Compatible with any sauce — bolognese, tomato, carbonara or local groundnut sauce. Popular in Kampala restaurants and homes.",
        stock: 180, badge: "Imported"
    },
    // Sugar
    {
        id: 26, name: "White Granulated Sugar", category: "sugar", unit: "1 kg pack",
        price: 4500, originalPrice: 5500, discount: 18, rating: 4.8, reviews: 902,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
        description: "Refined white granulated sugar from Uganda's Kakira Sugar Works — pure, clean sweetness you can trust. Ideal for sweetening tea, coffee, porridge, baking mandazi, cakes and preserving. Consistent grain size dissolves quickly. Uganda's most trusted sugar brand.",
        stock: 400, badge: "Kakira"
    },
    {
        id: 27, name: "Brown Sugar (Raw Cane)", category: "sugar", unit: "500g pack",
        price: 3500, originalPrice: 4500, discount: 22, rating: 4.7, reviews: 231,
        image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=400&fit=crop",
        description: "Unrefined raw cane brown sugar with natural molasses still intact. Slightly richer in minerals than white sugar. Adds a warm, caramel-like flavour depth to baked goods, porridge, ginger tea and beverages. A healthier alternative for conscious consumers.",
        stock: 300, badge: "Natural"
    },
    {
        id: 28, name: "Green Pepper (Hoho)", category: "vegetables", unit: "3-piece pack",
        price: 2500, originalPrice: 3500, discount: 29, rating: 4.6, reviews: 175,
        image: "https://images.unsplash.com/photo-1506802913710-9b7b8eb2e5d1?w=400&h=400&fit=crop",
        description: "Crispy, vivid green bell peppers (hoho) with a mild, refreshing flavour. Excellent source of Vitamin C and B6. Popular in Ugandan pilau, fried rice, pizza toppings and stuffed pepper dishes. Adds beautiful colour and crunch to any meal.",
        stock: 60, badge: "Crispy Fresh"
    }
];

export const heroSlides = [
    { id: 1, tag: "Daily Fresh Deals", title: "Farm to Table,\nEvery Single Day", subtitle: "Handpicked fresh produce delivered to your door within hours of harvest.", cta: "Shop Fresh", bg: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&h=500&fit=crop" },
    { id: 2, tag: "Dry Foods Sale – Up to 30% Off", title: "Stock Your Pantry\nSmart & Affordable", subtitle: "Premium rice, grains, flour, beans and more. Bulk deals that save you more.", cta: "Shop Dry Foods", bg: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1400&h=500&fit=crop" },
    { id: 3, tag: "Free Delivery Today", title: "Quality You Can\nTaste, Prices You'll Love", subtitle: "SkieZ Fresh Farm brings you the best from local farms — fresher, faster.", cta: "Order Now", bg: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1400&h=500&fit=crop" }
];

export const tickerItems = [
    { text: "Pishori Rice 2kg", price: "UGX 12,000", original: "UGX 15,000" },
    { text: "Fresh Tomatoes 1kg", price: "UGX 2,500", original: "UGX 3,200" },
    { text: "Sunflower Oil 2L", price: "UGX 18,000", original: "UGX 22,000" },
    { text: "Avocados (3pcs)", price: "UGX 4,000", original: "UGX 5,500" },
    { text: "Posho Flour 2kg", price: "UGX 6,000", original: "UGX 8,000" },
    { text: "Eggs Tray (30)", price: "UGX 18,000", original: "UGX 22,000" },
    { text: "Green Grams 500g", price: "UGX 4,500", original: "UGX 6,000" },
    { text: "Pilau Masala 100g", price: "UGX 4,500", original: "UGX 6,000" },
];
