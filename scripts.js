document.addEventListener('DOMContentLoaded', () => {
    console.log("AyurWellness Hub Initializing (Full Integration)...");

    // --- Global Profile Store ---
    let userProfile = {
        name: null,
        dosha: null, // Will be 'Vata', 'Pitta', 'Kapha'
        age: null,
    };

    // --- DOM Elements - Profile & Navigation ---
    const profileDoshaSelect = document.getElementById('profileDoshaSelect');
    const profileAgeInput = document.getElementById('profileAgeInput');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const profileErrorMessagesDiv = document.getElementById('profileErrorMessages');
    const userProfileSection = document.getElementById('userProfileSection');
    const mainNav = document.getElementById('mainNav');
    const appMainContent = document.getElementById('appMainContent');

    // --- DOM Elements - Modules ---
    const dashboardSection = document.getElementById('dashboardSection');
    const dietPlannerModule = document.getElementById('dietPlannerModule');
    const exerciseAdvisorModule = document.getElementById('exerciseAdvisorModule');
    const stressManagementModule = document.getElementById('stressManagementModule');
    const vitalsAdvisorModule = document.getElementById('vitalsAdvisorModule');
    
    const moduleSections = [];
    if (dashboardSection) moduleSections.push(dashboardSection);
    if (dietPlannerModule) moduleSections.push(dietPlannerModule);
    if (exerciseAdvisorModule) moduleSections.push(exerciseAdvisorModule);
    if (stressManagementModule) moduleSections.push(stressManagementModule);
    if (vitalsAdvisorModule) moduleSections.push(vitalsAdvisorModule);

    const dashboardWelcomeMessage = document.getElementById('dashboardWelcomeMessage');

    // Diet Planner Elements
    const dietDoshaRecap = document.getElementById('dietDoshaRecap');
    const dietAgeRecap = document.getElementById('dietAgeRecap');
    const foodTypeSelect = document.getElementById('food-type-select');
    const getDietRecommendationsBtn = document.getElementById('get-diet-recommendations-btn');
    const dietRecommendationsOutput = document.getElementById('diet-recommendations-output');
    const dietDoshaCharacteristicsDiv = document.getElementById('diet-dosha-characteristics');
    const dietFoodCategoriesPacifyingDiv = document.getElementById('diet-food-categories-pacifying');
    const dietFoodCategoriesAggravatingDiv = document.getElementById('diet-food-categories-aggravating');
    const showCustomDietPlanBtn = document.getElementById('show-custom-diet-plan-btn');
    const customDietPlanOutput = document.getElementById('custom-diet-plan-output');
    const selectedFoodsDietDisplay = document.getElementById('selected-foods-diet-display');

    // Exercise Advisor Elements
    const exerciseDoshaRecap = document.getElementById('exerciseDoshaRecap');
    const exerciseAgeRecap = document.getElementById('exerciseAgeRecap');
    const getExerciseRecommendationsBtn = document.getElementById('get-exercise-recommendations-btn');
    const exerciseRecommendationsArea = document.getElementById('exercise-recommendations-area');
    const exerciseErrorMessagesDiv = document.getElementById('exercise-errorMessages');
    const exerciseHowToUseGuideDiv = document.getElementById('exercise-howToUseGuideDiv');
    const exerciseThrDiv = document.getElementById('exercise-thrDiv');
    const exerciseWeeklyFrequencyByAgeDiv = document.getElementById('exercise-weeklyFrequencyByAgeDiv');
    const exerciseRegularWorkoutDiv = document.getElementById('exercise-regularWorkoutDiv');
    const exerciseIntensiveWorkoutDiv = document.getElementById('exercise-intensiveWorkoutDiv');
    const exercisePassiveWorkoutDiv = document.getElementById('exercise-passiveWorkoutDiv');
    const exerciseDoshaSpecificRecommendationsDiv = document.getElementById('exercise-doshaSpecificRecommendationsDiv');
    const exerciseGeneralNotesDiv = document.getElementById('exercise-generalNotesDiv');
    const exerciseExerciseActionsToAvoidDiv = document.getElementById('exercise-exerciseActionsToAvoidDiv');
    const exerciseExternalResourcesDiv = document.getElementById('exercise-externalResourcesDiv');

    // Stress Management Elements
    const hubStressDoshaRecap = document.getElementById('hubStressDoshaRecap');
    const hubSessionDurationSelect = document.getElementById('hubSessionDurationSelect');
    const hubStartStressSessionBtn = document.getElementById('hubStartStressSessionBtn');
    const hubStressSessionOutput = document.getElementById('hubStressSessionOutput');

    if (!profileDoshaSelect || !profileAgeInput || !saveProfileBtn || !userProfileSection || !mainNav || !appMainContent) {
        console.error("CRITICAL: Core profile or navigation elements missing from HTML!");
        if (profileErrorMessagesDiv) profileErrorMessagesDiv.textContent = "Page structure error. App cannot load.";
        else if (document.body) { // Fallback error display
            const errDiv = document.createElement('div'); 
            errDiv.style.color="red"; errDiv.style.textAlign="center"; errDiv.style.padding="20px";
            errDiv.textContent = "CRITICAL PAGE ERROR: Some essential HTML elements are missing.";
            document.body.prepend(errDiv);
        }
        return; 
    }
    
    const ELEVENLABS_API_KEY = "sk_6bf16533cf73dc89bd81869eb64edd1dfcbc614800ec3634";
    const SUNNY_SINGH_VOICE_ID = "aXbjk4JoIDXdCNz29TrS";

    const HubData = {
        dietPlannerData: {
            "Vata": {
                characteristics: "Dry, light, cold, rough, subtle, mobile, clear. Governs movement.",
                dietaryNeeds: "Warm, moist, grounding, nourishing foods. Regular meal times.",
                avoid: "Dry, cold, light foods. Raw vegetables in excess, beans (unless well-cooked and spiced), caffeine, carbonated drinks.",
                idealFoods: "Cooked grains (oats, rice), root vegetables, sweet fruits, warming dairy, soaked nuts and seeds, healthy fats like ghee or sesame oil.",
                tastesBalancedBy: "Sweet, Sour, Salty",
                qualitiesBalancedBy: "Warm, Heavy, Oily",
                foodCategories: { /* FROM DOCX */
                    fruits: { pacifying: ["Apples (cooked)", "Applesauce", "Apricots", "Bananas (ripe, not green)", "Berries", "Cantaloupe", "Cherries", "Coconut", "Dates (fresh, cooked, or soaked)", "Figs (fresh, cooked, or soaked)", "Grapefruit", "Grapes", "Kiwi", "Lemon", "Lime", "Mango", "Melons", "Oranges", "Papaya", "Peaches", "Pineapple", "Plums", "Prunes (cooked or soaked)", "Raisins (cooked or soaked)", "Tamarind"], aggravating: ["Apples (raw)", "Bananas (green)", "Cranberries", "Dates (dry)", "Dried fruits, in general", "Figs (dry)", "Pears", "Persimmons", "Pomegranate", "Prunes (dry)", "Raisins (dry)", "Watermelon"], useInModeration: [] },
                    vegetables: { pacifying: ["Asparagus", "Avocado", "Beets", "Carrots, Cooked", "Chilies ", "Cilantro", "Cucumber", "Garlic", "Green Beans", "Green Chilies", "Leeks", "Mustard Greens", "Okra", "Olives (black)", "Onion, Cooked", "Parsnip", "Peas, Cooked", "Pumpkin", "Rutabega", "Spinach, Cooked", "Squash, Summer", "Squash, Winter", "Sweet Potatoes", "Watercress", "Zucchini"], aggravating: ["Artichokes", "Beet Greens", "Bell Peppers", "Bitter Melon", "Broccoli", "Brussels Sprouts", "Burdock Root", "Cabbage", "Carrots, Raw", "Cauliflower", "Celery", "Chilies (in excess)", "Corn, Fresh", "Dandelion Greens", "Eggplant", "Jerusalem Artichokes", "Kale", "Kohlrabi", "Lettuce", "Mushrooms", "Olives, Green", "Onion, Raw", "Peas, Raw", "Peppers, Hot", "Potatoes, White", "Radishes", "Spinach, Raw", "Sprouts", "Tomatoes", "Turnips"], useInModeration: [] },
                    grains: { pacifying: ["Amaranth", "Durham Flour", "Oats, Cooked", "Pancakes", "Quinoa", "Rice (all types)", "Seitan", "Sprouted Wheat Bread", "Wheat"], aggravating: ["Barley", "Buckwheat", "Cereals (cold, dry, or puffed)", "Corn", "Couscous", "Crackers", "Granola", "Millet", "Muesli", "Oat Bran", "Oats, Dry", "Pasta, Wheat", "Rice Cakes", "Rye", "Spelt", "Tapioca", "Wheat Bran", "Yeasted Bread"], useInModeration: [] },
                    legumes: { pacifying: ["Lentils, Red", "Miso", "Mung Beans", "Mung Dal, Split", "Soy Cheese", "Soy Milk (served warm)", "Soy Sauce", "Soy Meats", "Tofu (served hot)", "Toor Dal", "Urad Dal"], aggravating: ["Adzuki Beans", "Black Beans", "Black-Eyed Peas", "Garbanzo Beans (Chickpeas)", "Kidney Beans", "Lentils, Brown", "Lima Beans", "Navy Beans", "Pinto Beans", "Soy Beans", "Soy Flour", "Soy Powder", "Split Peas", "Tempeh", "White Beans"], useInModeration: [] },
                    dairy: { pacifying: ["Butter", "Buttermilk", "Cheese", "Cottage Cheese", "Cow’s Milk", "Almond Milk", "Rice Milk", "Oat Milk", "Ghee", "Goat’s Milk", "Ice Cream (in moderation)", "Sour Cream (in moderation)", "Yogurt (fresh)"], aggravating: ["Frozen Yogurt", "Powdered Milk"], useInModeration: [] },
                    nutsSeeds: { pacifying: ["Almonds", "Brazil Nuts", "Cashews", "Coconut", "Hazelnuts", "Macadamia Nuts", "Peanuts", "Pecans", "Pine nuts", "Pistachios", "Pumpkin Seeds", "Sesame Seeds", "Sunflower Seeds", "Walnuts"], aggravating: ["Popcorn"], useInModeration: [] },
                    eggsMeats: { pacifying: ["Beef", "Buffalo", "Chicken (especially dark)", "Duck", "Eggs", "Fish (fresh and saltwater)", "Salmon", "Sardines", "Seafood", "Shrimp", "Tuna Fish", "Turkey (dark)"], aggravating: ["Lamb", "Mutton", "Pork", "Venison", "Turkey (white)"], useInModeration: [] },
                    oils: { pacifying: ["Almond Oil", "Avocado Oil", "Castor Oil", "Coconut Oil", "Ghee", "Mustard Oil", "Olive Oil", "Peanut Oil", "Safflower Oil", "Sesame Oil", "Sunflower Oil"], aggravating: ["Canola Oil", "Corn Oil", "Flax Seed Oil", "Soy Oil"], useInModeration: [] },
                    sweeteners: { pacifying: ["Barley Malt", "Date Sugar", "Fructose", "Fruit Juice Concentrates", "Honey (raw)", "Jaggary", "Maple Syrup (in moderation)", "Molasses", "Rice Syrup", "Sucanat", "Turbinado"], aggravating: ["Artificial Sweeteners", "White Sugar", "Honey (heated or cooked)"], useInModeration: [] },
                    spices: { pacifying: ["Ajwan", "Allspice", "Anise", "Basil", "Bay Leaf", "Black Pepper", "Caraway", "Cardamom", "Cinnamon", "Cloves", "Coriander (seeds or powder)", "Cumin (seeds or powder)", "Dill", "Fennel", "Garlic", "Ginger (fresh or dried)", "Hing (Asafoetida)", "Mace", "Marjoram", "Mint", "Mustard Seeds", "Nutmeg", "Oregano", "Paprika", "Parsley", "Peppermint", "Pippali", "Poppy Seeds", "Rosemary", "Saffron", "Salt", "Savory", "Tarragon", "Thyme", "Turmeric", "Vanilla"], aggravating: [], useInModeration: ["Cayenne Pepper", "Chili Powder", "Fenugreek", "Horseradish", "Neem Leaves"] }
                }
            },
            "Pitta": {
                characteristics: "Hot, sharp, light, liquid, oily, spreading. Governs digestion, metabolism, and transformation.",
                dietaryNeeds: "Prefers cooling, slightly dry, and substantial foods. Benefits from regular meals and avoiding excessive spice or heat.",
                avoid: "Generally avoid pungent (hot/spicy), sour, and salty foods in excess. Fried foods, alcohol, coffee, and overly fermented items can aggravate Pitta.",
                idealFoods: "Focus on sweet, bitter, and astringent tastes. Cooling grains like basmati rice and barley, sweet fruits, most vegetables (especially green and watery ones), and cooling dairy.",
                tastesBalancedBy: "Sweet, Bitter, Astringent",
                qualitiesBalancedBy: "Cool, Heavy, Dry",
                foodCategories: {
                    fruits: { pacifying: ["Apples (sweet)", "Applesauce", "Apricots (sweet)", "Berries (sweet)", "Cherries (sweet)", "Coconut", "Dates", "Figs", "Grapes (red, purple, black)", "Limes", "Mangos (ripe)", "Melons", "Oranges (sweet)", "Papaya", "Pears", "Pineapple (sweet)", "Plums (sweet)", "Pomegranates", "Prunes", "Raisins", "Strawberries", "Watermelon"], aggravating: ["Apples (sour)", "Apricots (sour)", "Bananas", "Berries (sour)", "Cherries (sour)", "Cranberries", "Grapefruit", "Grapes (green)", "Kiwi", "Lemons", "Mangos (green)", "Oranges (sour)", "Peaches", "Persimmons", "Pineapple (sour)", "Plums (sour)", "Tamarind"], useInModeration: [] },
                    vegetables: { pacifying: ["Avocado", "Artichoke", "Asparagus", "Beets (cooked)", "Bell Peppers", "Bitter Melon", "Broccoli", "Brussels Sprouts", "Burdock Root", "Cabbage", "Carrots (cooked)", "Cauliflower", "Celery", "Cilantro", "Collard Greens", "Cucumber", "Dandelion Greens", "Green Beans", "Jerusalem Artichoke", "Kale", "Leafy Greens", "Leeks (cooked)", "Lettuce", "Mushrooms", "Okra", "Olives (black)", "Onions (cooked)", "Parsley", "Parsnips", "Peas", "Peppers (sweet)", "Potatoes", "Pumpkin", "Radishes (cooked)", "Rutabaga", "Spaghetti Squash", "Sprouts (not spicy)", "Squash, Summer", "Squash, Winter", "Spinach (raw)", "Sweet Potatoes", "Watercress", "Wheat Grass", "Zucchini"], aggravating: ["Beet Greens", "Beets (raw)", "Corn (fresh)", "Daikon Radish", "Eggplant", "Garlic", "Green Chilies", "Horseradish", "Kohlrabi", "Leeks (raw)", "Mustard Greens", "Olives, green", "Onions (raw)", "Peppers (hot)", "Radishes (raw)", "Spinach (cooked)", "Tomatoes", "Turnip greens", "Turnips"], useInModeration: [] },
                    grains: { pacifying: ["Amaranth", "Barley", "Cereal (dry)", "Couscous", "Crackers", "Durham Flour", "Granola", "Oat Bran", "Oats", "Pancakes", "Pasta", "Quinoa", "Rice (basmati, white, wild)", "Rice Cakes", "Seitan", "Spelt", "Sprouted Wheat Bread", "Tapioca", "Wheat", "Wheat Bran"], aggravating: ["Buckwheat", "Corn", "Millet", "Muesli", "Polenta", "Rice (brown)", "Rye", "Yeasted Bread"], useInModeration: [] },
                    legumes: { pacifying: ["Adzuki Beans", "Black Beans", "Black-Eyed Peas", "Garbanzo Beans (Chickpeas)", "Kidney Beans", "Lentils", "Lima Beans", "Mung Beans", "Mung Dal", "Navy Beans", "Pinto Beans", "Split Peas", "Soy Beans", "Soy Cheese", "Soy Flour", "Soy Milk", "Soy Powder", "Tempeh", "Tofu", "White Beans"], aggravating: ["Miso", "Soy Meats", "Soy Sauce", "Urad Dal"], useInModeration: [] },
                    dairy: { pacifying: ["Butter (unsalted)", "Cheese (soft, unsalted, not aged)", "Cottage Cheese", "Cow’s Milk", "Ghee", "Goat’s Milk", "Goat’s Cheese (soft, unsalted)", "Ice Cream", "Yogurt (homemade, diluted, without fruit)"], aggravating: ["Butter (salted)", "Buttermilk", "Cheese (hard)", "Frozen Yogurt", "Sour Cream", "Yogurt (store-bought or with fruit)"], useInModeration: [] },
                    nutsSeeds: { pacifying: ["Almonds (soaked and peeled)", "Charoli Nuts", "Coconut", "Flax Seeds", "Halva", "Popcorn (buttered, without salt)", "Pumpkin Seeds", "Sunflower Seeds"], aggravating: ["Almonds (with skin)", "Brazil Nuts", "Cashews", "Chia Seeds", "Filberts", "Macadamia Nuts", "Peanuts", "Pecans", "Pine Nuts", "Pistachios", "Sesame Seeds", "Tahini", "Walnut"], useInModeration: [] },
                    eggsMeats: { pacifying: ["Buffalo", "Chicken (white)", "Eggs (white only)", "Fish (freshwater)", "Rabbit", "Shrimp", "Turkey (white)", "Venison"], aggravating: ["Beef", "Chicken (dark)", "Duck", "Eggs (yolk)", "Fish (saltwater)", "Lamb", "Pork", "Salmon", "Sardines", "Seafood", "Tuna Fish", "Turkey (dark)"], useInModeration: [] },
                    oils: { pacifying: ["Coconut Oil", "Flax Seed Oil", "Ghee", "Olive Oil", "Primrose Oil", "Sunflower Oil", "Soy Oil", "Walnut Oil"], aggravating: ["Almond Oil", "Apricot Oil", "Corn Oil", "Safflower Oil", "Sesame Oil"], useInModeration: [] },
                    sweeteners: { pacifying: ["Barley Malt", "Date Sugar", "Fructose", "Fruit Juice Concentrates", "Maple Syrup", "Rice Syrup", "Sucanat", "Turbinado"], aggravating: ["Honey", "Jaggary", "Molasses", "White Sugar"], useInModeration: [] },
                    spices: { pacifying: ["Basil (fresh)", "Black Pepper (small amounts)", "Cardamom", "Cinnamon (small amounts)", "Coriander (seeds or powder)", "Cumin (seeds or powder)", "Dill", "Fennel", "Ginger (fresh)", "Mint", "Neem Leaves", "Orange Peel", "Parsley", "Peppermint", "Saffron", "Spearmint", "Tarragon", "Turmeric", "Vanilla", "Wintergreen"], aggravating: ["Ajwan", "Allspice", "Anise", "Basil (dry)", "Bay Leaf", "Caraway", "Cayenne", "Cloves", "Fenugreek", "Garlic", "Ginger (dry)", "Hing (Asafoetida)", "Mace", "Marjoram", "Mustard Seeds", "Nutmeg", "Oregano", "Paprika", "Pippali", "Poppy Seeds", "Rosemary", "Sage", "Salt", "Savory", "Thyme", "Trikatu"], useInModeration: [] }
                }
            },
            "Kapha": {
                characteristics: "Associated with earth and water. Qualities: heavy, slow, cool, oily, smooth, dense, stable, cloudy. Governs structure, stability, and lubrication.",
                dietaryNeeds: "Prefers light, dry, and warm foods. Benefits from pungent, bitter, and astringent tastes to stimulate digestion and metabolism.",
                avoid: "Generally avoid heavy, oily, cold, sweet, sour, and salty foods in excess. Overly processed foods, excessive dairy, and deep-fried items can aggravate Kapha.",
                idealFoods: "Focus on light fruits, most vegetables (especially leafy greens and cruciferous), pungent spices, and lighter grains like barley and millet. Legumes are generally good.",
                tastesBalancedBy: "Pungent, Bitter, Astringent",
                qualitiesBalancedBy: "Light, Dry, Warm",
                foodCategories: {
                    fruits: { pacifying: ["Apples", "Applesauce", "Apricots", "Berries", "Cherries", "Cranberries", "Figs (dry)", "Grapes (red, purple, black)", "Lemons", "Limes", "Mango", "Peaches", "Pears", "Persimmons", "Pomegranates", "Prunes", "Raisins", "Raspberries", "Strawberries"], aggravating: ["Bananas", "Cantaloupe", "Coconut", "Dates", "Figs (fresh)", "Grapes (green)", "Grapefruit", "Kiwi", "Melons", "Oranges", "Papaya", "Pineapple", "Plums", "Rhubarb", "Tamarin", "Watermelon"], useInModeration: [] },
                    vegetables: { pacifying: ["Artichoke", "Asparagus", "Beet Greens", "Beets", "Bell Peppers", "Bitter Melon", "Broccoli", "Brussels Sprouts", "Burdock Root", "Cabbage", "Carrots", "Cauliflower", "Celery", "Chilies", "Cilantro", "Collard Greens", "Corn", "Daikon Radish", "Dandelion Greens", "Eggplant", "Garlic", "Green Beans", "Horseradish", "Jerusalem Artichokes", "Kale", "Kohlrabi", "Leafy Greens", "Leeks", "Lettuce", "Mustard Greens", "Okra", "Onions", "Peas", "Peppers, Sweet & Hot", "Potatoes, White", "Radishes", "Rutabaga", "Spaghetti Squash", "Spinach", "Sprouts", "Squash, Winter", "Tomatoes (cooked)", "Turnips", "Watercress", "Wheat Grass"], aggravating: ["Avocado", "Cucumber", "Olives", "Parsnips", "Pumpkin", "Squash, Summer", "Sweet Potatoes", "Tomatoes (raw)", "Zucchini"], useInModeration: [] },
                    grains: { pacifying: ["Amaranth", "Barley", "Buckwheat", "Cereal (unsweetened, cold, dry)", "Corn", "Couscous", "Crackers", "Durham Flour", "Granola", "Millet", "Muesli", "Oat Bran", "Oats (dry)", "Polenta", "Quinoa", "Rice (basmati, wild)", "Rice Cakes", "Rye", "Seitan", "Spelt", "Sprouted Wheat Bread", "Tapioca", "Wheat Bran"], aggravating: ["Oats (cooked)", "Pancakes", "Pasta", "Rice (brown, white)", "Wheat", "Yeasted Bread"], useInModeration: [] },
                    legumes: { pacifying: ["Adzuki Beans", "Black Beans", "Black-Eyed Peas", "Garbanzo Beans (Chickpeas)", "Lentils", "Lima Beans", "Mung Beans", "Mung Dal", "Navy Beans", "Pinto Beans", "Split Peas", "Soy Milk", "Soy Meats", "Tempeh", "Tofu (served hot)", "Toor Dal", "White Beans"], aggravating: ["Kidney Beans", "Miso", "Soy Beans", "Soy Cheese", "Soy Flour", "Soy Powder", "Soy Sauce", "Tofu (served cold)", "Urad Dal"], useInModeration: [] },
                    dairy: { pacifying: ["Buttermilk", "Cottage Cheese (ideally from skim goat’s milk)", "Ghee", "Goat’s Cheese (unsalted, not aged)", "Goat’s Milk (skim)", "Yogurt (fresh and diluted)"], aggravating: ["Butter", "Cheese", "Cow’s Milk", "Frozen Yogurt", "Ice Cream", "Sour Cream", "Yogurt (store-bought)"], useInModeration: [] },
                    nutsSeeds: { pacifying: ["Almonds (soaked and peeled)", "Charole Nuts", "Chia Seeds", "Flax Seeds", "Popcorn (without salt or butter)", "Pumpkin Seeds", "Sunflower Seeds"], aggravating: ["Brazil Nuts", "Cashews", "Coconut", "Filberts", "Macadamia Nuts", "Peanuts", "Pecans", "Pine Nuts", "Pistachios", "Sesame Seeds", "Tahini", "Walnuts"], useInModeration: [] },
                    eggsMeats: { pacifying: ["Chicken (white)", "Eggs (not fried, and in moderation)", "Fish (freshwater)", "Shrimp", "Turkey (white)", "Venison"], aggravating: ["Beef", "Buffalo", "Chicken (dark)", "Duck", "Fish (saltwater)", "Lamb", "Pork", "Salmon", "Sardines", "Seafood", "Tuna Fish", "Turkey (dark)"], useInModeration: [] },
                    oils: { pacifying: ["Almond Oil", "Corn Oil", "Flax Seed Oil", "Ghee", "Sunflower Oil"], aggravating: ["Avocado Oil", "Apricot Oil", "Coconut Oil", "Olive Oil", "Primrose Oil", "Safflower Oil", "Sesame Oil", "Soy Oil", "Walnut Oil"], useInModeration: [] },
                    sweeteners: { pacifying: ["Fruit Juice Concentrates", "Honey (raw and unprocessed)"], aggravating: ["Artificial Sweeteners", "Barley Malt", "Date Sugar", "Fructose", "Honey (cooked, heated, or processed)", "Jaggary", "Maple Syrup", "Molasses", "Rice Syrup", "Sucanat", "Turbinado", "White Sugar"], useInModeration: [] },
                    spices: { pacifying: ["Ajwan", "Allspice", "Anise", "Basil", "Bay Leaf", "Black Pepper", "Caraway", "Cardamom", "Cayenne", "Cinnamon", "Cloves", "Coriander (seeds or powder)", "Cumin (seeds or powder)", "Dill", "Fennel", "Fenugreek", "Garlic", "Ginger (fresh or dried)", "Hing (Asafoetida)", "Mace", "Marjoram", "Mint", "Mustard Seeds", "Neem Leaves", "Nutmeg", "Oregano", "Paprika", "Parsley", "Peppermint", "Pippali", "Poppy Seeds", "Rosemary", "Saffron", "Savory", "Spearmint", "Tarragon", "Thyme", "Trikatu", "Turmeric", "Vanilla", "Wintergreen"], aggravating: ["Salt (in excess)"], useInModeration: [] }
                }
            }, // End Kapha
            nutritionData: {
                // THIS SECTION MUST BE THOROUGHLY POPULATED by you
                // to match food names from foodCategories for accurate nutritional calculations.
                // Example entries:
                
    "Apples": {"calories": 52.0, "protein": 0.3, "carbs": 13.8, "fat": 0.2, "unit": "g"},
    "Apples (cooked)": {"calories": 53.0, "protein": 0.3, "carbs": 14.0, "fat": 0.3, "unit": "g"},
    "Apples (dried)": {"calories": 243.0, "protein": 0.9, "carbs": 65.9, "fat": 0.1, "unit": "g"},
    "Apples (sweet)": {"calories": 52.0, "protein": 0.3, "carbs": 13.8, "fat": 0.2, "unit": "g"},
    "Apples (sour)": {"calories": 52.0, "protein": 0.3, "carbs": 13.8, "fat": 0.2, "unit": "g"},
    "Applesauce": {"calories": 102.0, "protein": 0.2, "carbs": 27.1, "fat": 0.1, "unit": "g"},
    "Applesauce (unsweetened)": {"calories": 102.0, "protein": 0.2, "carbs": 27.1, "fat": 0.1, "unit": "g"},
    "Apricots": {"calories": 48.0, "protein": 1.4, "carbs": 11.1, "fat": 0.4, "unit": "g"},
    "Apricots (dried)": {"calories": 241.0, "protein": 3.4, "carbs": 62.6, "fat": 0.5, "unit": "g"},
    "Apricots (sweet)": {"calories": 48.0, "protein": 1.4, "carbs": 11.1, "fat": 0.4, "unit": "g"},
    "Apricots (sour)": {"calories": 48.0, "protein": 1.4, "carbs": 11.1, "fat": 0.4, "unit": "g"},
    "Avocado": {"calories": 160.0, "protein": 2.0, "carbs": 8.5, "fat": 14.7, "unit": "g"},
    "Bananas": {"calories": 89.0, "protein": 1.1, "carbs": 22.8, "fat": 0.3, "unit": "g"},
    "Bananas (ripe, not green)": {"calories": 89.0, "protein": 1.1, "carbs": 22.8, "fat": 0.3, "unit": "g"},
    "Bananas (green)": {"calories": 89.0, "protein": 1.1, "carbs": 22.8, "fat": 0.3, "unit": "g"},
    "Berries": {"calories": 43.0, "protein": 1.1, "carbs": 10.5, "fat": 0.4, "unit": "g"},
    "Berries (sweet)": {"calories": 57.0, "protein": 0.7, "carbs": 14.5, "fat": 0.3, "unit": "g"},
    "Berries (sour)": {"calories": 32.0, "protein": 0.4, "carbs": 8.2, "fat": 0.2, "unit": "g"},
    "Cantaloupe": {"calories": 34.0, "protein": 0.8, "carbs": 8.2, "fat": 0.2, "unit": "g"},
    "Cherries": {"calories": 63.0, "protein": 1.1, "carbs": 16.0, "fat": 0.2, "unit": "g"},
    "Cherries (sweet)": {"calories": 63.0, "protein": 1.1, "carbs": 16.0, "fat": 0.2, "unit": "g"},
    "Cherries (sour)": {"calories": 50.0, "protein": 1.0, "carbs": 12.2, "fat": 0.3, "unit": "g"},
    "Coconut": {"calories": 354.0, "protein": 3.3, "carbs": 15.2, "fat": 33.5, "unit": "g"},
    "Cranberries": {"calories": 46.0, "protein": 0.4, "carbs": 12.2, "fat": 0.1, "unit": "g"},
    "Dates": {"calories": 282.0, "protein": 2.5, "carbs": 75.0, "fat": 0.4, "unit": "g"},
    "Dates (fresh, cooked, or soaked)": {"calories": 282.0, "protein": 2.5, "carbs": 75.0, "fat": 0.4, "unit": "g"},
    "Dates (dry)": {"calories": 282.0, "protein": 2.5, "carbs": 75.0, "fat": 0.4, "unit": "g"},
    "Figs": {"calories": 74.0, "protein": 0.8, "carbs": 19.2, "fat": 0.3, "unit": "g"},
    "Figs (fresh, cooked, or soaked)": {"calories": 74.0, "protein": 0.8, "carbs": 19.2, "fat": 0.3, "unit": "g"},
    "Figs (dry)": {"calories": 249.0, "protein": 3.3, "carbs": 63.9, "fat": 0.9, "unit": "g"},
    "Figs (fresh)": {"calories": 74.0, "protein": 0.8, "carbs": 19.2, "fat": 0.3, "unit": "g"},
    "Grapefruit": {"calories": 42.0, "protein": 0.8, "carbs": 10.7, "fat": 0.1, "unit": "g"},
    "Grapes": {"calories": 69.0, "protein": 0.7, "carbs": 18.1, "fat": 0.2, "unit": "g"},
    "Grapes (red, purple, black)": {"calories": 69.0, "protein": 0.7, "carbs": 18.1, "fat": 0.2, "unit": "g"},
    "Grapes (green)": {"calories": 69.0, "protein": 0.7, "carbs": 18.1, "fat": 0.2, "unit": "g"},
    "Kiwi": {"calories": 61.0, "protein": 1.1, "carbs": 14.7, "fat": 0.5, "unit": "g"},
    "Lemon": {"calories": 29.0, "protein": 1.1, "carbs": 9.3, "fat": 0.3, "unit": "g"},
    "Lime": {"calories": 30.0, "protein": 0.7, "carbs": 10.5, "fat": 0.2, "unit": "g"},
    "Mango": {"calories": 60.0, "protein": 0.8, "carbs": 15.0, "fat": 0.4, "unit": "g"},
    "Mango (ripe)": {"calories": 60.0, "protein": 0.8, "carbs": 15.0, "fat": 0.4, "unit": "g"},
    "Mango (green)": {"calories": 60.0, "protein": 0.8, "carbs": 15.0, "fat": 0.4, "unit": "g"},
    "Melons": {"calories": 34.0, "protein": 0.8, "carbs": 8.2, "fat": 0.2, "unit": "g"},
    "Oranges": {"calories": 47.0, "protein": 0.9, "carbs": 11.8, "fat": 0.1, "unit": "g"},
    "Oranges (sweet)": {"calories": 47.0, "protein": 0.9, "carbs": 11.8, "fat": 0.1, "unit": "g"},
    "Oranges (sour)": {"calories": 47.0, "protein": 0.9, "carbs": 11.8, "fat": 0.1, "unit": "g"},
    "Papaya": {"calories": 43.0, "protein": 0.5, "carbs": 10.8, "fat": 0.3, "unit": "g"},
    "Peaches": {"calories": 39.0, "protein": 0.9, "carbs": 9.5, "fat": 0.3, "unit": "g"},
    "Pears": {"calories": 57.0, "protein": 0.4, "carbs": 15.2, "fat": 0.1, "unit": "g"},
    "Persimmons": {"calories": 70.0, "protein": 0.6, "carbs": 18.6, "fat": 0.2, "unit": "g"},
    "Pineapple": {"calories": 50.0, "protein": 0.5, "carbs": 13.1, "fat": 0.1, "unit": "g"},
    "Pineapple (sweet)": {"calories": 50.0, "protein": 0.5, "carbs": 13.1, "fat": 0.1, "unit": "g"},
    "Pineapple (sour)": {"calories": 50.0, "protein": 0.5, "carbs": 13.1, "fat": 0.1, "unit": "g"},
    "Plums": {"calories": 46.0, "protein": 0.7, "carbs": 11.4, "fat": 0.3, "unit": "g"},
    "Plums (sweet)": {"calories": 46.0, "protein": 0.7, "carbs": 11.4, "fat": 0.3, "unit": "g"},
    "Plums (sour)": {"calories": 46.0, "protein": 0.7, "carbs": 11.4, "fat": 0.3, "unit": "g"},
    "Pomegranate": {"calories": 83.0, "protein": 1.7, "carbs": 18.7, "fat": 1.2, "unit": "g"},
    "Pomegranates": {"calories": 83.0, "protein": 1.7, "carbs": 18.7, "fat": 1.2, "unit": "g"},
    "Prunes": {"calories": 240.0, "protein": 2.2, "carbs": 63.9, "fat": 0.4, "unit": "g"},
    "Prunes (cooked or soaked)": {"calories": 100.0, "protein": 1.0, "carbs": 26.0, "fat": 0.2, "unit": "g"},
    "Prunes (dry)": {"calories": 240.0, "protein": 2.2, "carbs": 63.9, "fat": 0.4, "unit": "g"},
    "Raisins": {"calories": 299.0, "protein": 3.1, "carbs": 79.2, "fat": 0.5, "unit": "g"},
    "Raisins (cooked or soaked)": {"calories": 120.0, "protein": 1.2, "carbs": 31.7, "fat": 0.2, "unit": "g"},
    "Raisins (dry)": {"calories": 299.0, "protein": 3.1, "carbs": 79.2, "fat": 0.5, "unit": "g"},
    "Raspberries": {"calories": 52.0, "protein": 1.2, "carbs": 11.9, "fat": 0.7, "unit": "g"},
    "Rhubarb": {"calories": 21.0, "protein": 0.9, "carbs": 4.5, "fat": 0.2, "unit": "g"},
    "Strawberries": {"calories": 32.0, "protein": 0.7, "carbs": 7.7, "fat": 0.3, "unit": "g"},
    "Tamarind": {"calories": 239.0, "protein": 2.8, "carbs": 62.5, "fat": 0.6, "unit": "g"},
    "Tamarin": {"calories": 239.0, "protein": 2.8, "carbs": 62.5, "fat": 0.6, "unit": "g"},
    "Watermelon": {"calories": 30.0, "protein": 0.6, "carbs": 7.6, "fat": 0.2, "unit": "g"},
    "Dried fruits, in general": {"calories": 275.0, "protein": 3.0, "carbs": 70.0, "fat": 1.0, "unit": "g"},
    "Artichokes": {"calories": 47.0, "protein": 3.3, "carbs": 10.5, "fat": 0.2, "unit": "g"},
    "Artichoke": {"calories": 47.0, "protein": 3.3, "carbs": 10.5, "fat": 0.2, "unit": "g"},
    "Asparagus": {"calories": 20.0, "protein": 2.2, "carbs": 3.9, "fat": 0.1, "unit": "g"},
    "Beets": {"calories": 43.0, "protein": 1.6, "carbs": 9.6, "fat": 0.2, "unit": "g"},
    "Beets (cooked)": {"calories": 44.0, "protein": 1.7, "carbs": 10.0, "fat": 0.2, "unit": "g"},
    "Beets (raw)": {"calories": 43.0, "protein": 1.6, "carbs": 9.6, "fat": 0.2, "unit": "g"},
    "Beet Greens": {"calories": 22.0, "protein": 2.2, "carbs": 4.3, "fat": 0.1, "unit": "g"},
    "Bell Peppers": {"calories": 20.0, "protein": 0.9, "carbs": 4.6, "fat": 0.2, "unit": "g"},
    "Bitter Melon": {"calories": 17.0, "protein": 1.0, "carbs": 3.7, "fat": 0.2, "unit": "g"},
    "Broccoli": {"calories": 34.0, "protein": 2.8, "carbs": 6.6, "fat": 0.4, "unit": "g"},
    "Brussels Sprouts": {"calories": 43.0, "protein": 3.4, "carbs": 9.0, "fat": 0.3, "unit": "g"},
    "Burdock Root": {"calories": 72.0, "protein": 1.5, "carbs": 17.3, "fat": 0.1, "unit": "g"},
    "Cabbage": {"calories": 25.0, "protein": 1.3, "carbs": 5.8, "fat": 0.1, "unit": "g"},
    "Carrots": {"calories": 41.0, "protein": 0.9, "carbs": 9.6, "fat": 0.2, "unit": "g"},
    "Carrots, Cooked": {"calories": 35.0, "protein": 0.8, "carbs": 8.2, "fat": 0.2, "unit": "g"},
    "Carrots (cooked)": {"calories": 35.0, "protein": 0.8, "carbs": 8.2, "fat": 0.2, "unit": "g"},
    "Carrots, Raw": {"calories": 41.0, "protein": 0.9, "carbs": 9.6, "fat": 0.2, "unit": "g"},
    "Cauliflower": {"calories": 25.0, "protein": 1.9, "carbs": 5.0, "fat": 0.3, "unit": "g"},
    "Celery": {"calories": 16.0, "protein": 0.7, "carbs": 3.0, "fat": 0.2, "unit": "g"},
    "Chilies": {"calories": 40.0, "protein": 1.9, "carbs": 8.8, "fat": 0.4, "unit": "g"},
    "Chilies (in excess)": {"calories": 40.0, "protein": 1.9, "carbs": 8.8, "fat": 0.4, "unit": "g"},
    "Cilantro": {"calories": 23.0, "protein": 2.1, "carbs": 3.7, "fat": 0.5, "unit": "g"},
    "Collard Greens": {"calories": 32.0, "protein": 3.0, "carbs": 5.4, "fat": 0.6, "unit": "g"},
    "Corn": {"calories": 86.0, "protein": 3.2, "carbs": 19.0, "fat": 1.2, "unit": "g"},
    "Corn, Fresh": {"calories": 86.0, "protein": 3.2, "carbs": 19.0, "fat": 1.2, "unit": "g"},
    "Cucumber": {"calories": 15.0, "protein": 0.7, "carbs": 3.6, "fat": 0.1, "unit": "g"},
    "Daikon Radish": {"calories": 18.0, "protein": 0.6, "carbs": 4.1, "fat": 0.1, "unit": "g"},
    "Dandelion Greens": {"calories": 45.0, "protein": 2.7, "carbs": 9.2, "fat": 0.7, "unit": "g"},
    "Eggplant": {"calories": 25.0, "protein": 1.0, "carbs": 5.9, "fat": 0.2, "unit": "g"},
    "Garlic": {"calories": 149.0, "protein": 6.4, "carbs": 33.1, "fat": 0.5, "unit": "g"},
    "Green Beans": {"calories": 31.0, "protein": 1.8, "carbs": 7.0, "fat": 0.1, "unit": "g"},
    "Green Chilies": {"calories": 40.0, "protein": 2.0, "carbs": 9.5, "fat": 0.2, "unit": "g"},
    "Horseradish": {"calories": 48.0, "protein": 1.2, "carbs": 11.3, "fat": 0.7, "unit": "g"},
    "Jerusalem Artichokes": {"calories": 73.0, "protein": 2.0, "carbs": 17.4, "fat": 0.0, "unit": "g"},
    "Jerusalem Artichoke": {"calories": 73.0, "protein": 2.0, "carbs": 17.4, "fat": 0.0, "unit": "g"},
    "Kale": {"calories": 49.0, "protein": 4.3, "carbs": 8.8, "fat": 0.9, "unit": "g"},
    "Kohlrabi": {"calories": 27.0, "protein": 1.7, "carbs": 6.2, "fat": 0.1, "unit": "g"},
    "Leafy Greens": {"calories": 23.0, "protein": 2.5, "carbs": 3.8, "fat": 0.3, "unit": "g"},
    "Leeks": {"calories": 61.0, "protein": 1.5, "carbs": 14.2, "fat": 0.3, "unit": "g"},
    "Leeks (cooked)": {"calories": 31.0, "protein": 0.8, "carbs": 7.6, "fat": 0.2, "unit": "g"},
    "Leeks (raw)": {"calories": 61.0, "protein": 1.5, "carbs": 14.2, "fat": 0.3, "unit": "g"},
    "Lettuce": {"calories": 15.0, "protein": 1.4, "carbs": 2.9, "fat": 0.2, "unit": "g"},
    "Mushrooms": {"calories": 22.0, "protein": 3.1, "carbs": 3.3, "fat": 0.3, "unit": "g"},
    "Mustard Greens": {"calories": 27.0, "protein": 2.9, "carbs": 4.7, "fat": 0.4, "unit": "g"},
    "Okra": {"calories": 33.0, "protein": 1.9, "carbs": 7.5, "fat": 0.2, "unit": "g"},
    "Olives (black)": {"calories": 115.0, "protein": 0.8, "carbs": 6.3, "fat": 10.7, "unit": "g"},
    "Olives, Green": {"calories": 145.0, "protein": 1.0, "carbs": 3.8, "fat": 15.3, "unit": "g"},
    "Olives": {"calories": 115.0, "protein": 0.8, "carbs": 6.3, "fat": 10.7, "unit": "g"},
    "Onions": {"calories": 40.0, "protein": 1.1, "carbs": 9.3, "fat": 0.1, "unit": "g"},
    "Onion, Cooked": {"calories": 44.0, "protein": 1.2, "carbs": 10.2, "fat": 0.1, "unit": "g"},
    "Onions (cooked)": {"calories": 44.0, "protein": 1.2, "carbs": 10.2, "fat": 0.1, "unit": "g"},
    "Onion, Raw": {"calories": 40.0, "protein": 1.1, "carbs": 9.3, "fat": 0.1, "unit": "g"},
    "Onions (raw)": {"calories": 40.0, "protein": 1.1, "carbs": 9.3, "fat": 0.1, "unit": "g"},
    "Parsley": {"calories": 36.0, "protein": 3.0, "carbs": 6.3, "fat": 0.8, "unit": "g"},
    "Parsnips": {"calories": 75.0, "protein": 1.2, "carbs": 18.0, "fat": 0.3, "unit": "g"},
    "Parsnip": {"calories": 75.0, "protein": 1.2, "carbs": 18.0, "fat": 0.3, "unit": "g"},
    "Peas": {"calories": 81.0, "protein": 5.4, "carbs": 14.5, "fat": 0.4, "unit": "g"},
    "Peas, Cooked": {"calories": 84.0, "protein": 5.6, "carbs": 15.6, "fat": 0.2, "unit": "g"},
    "Peas, Raw": {"calories": 81.0, "protein": 5.4, "carbs": 14.5, "fat": 0.4, "unit": "g"},
    "Peppers, Hot": {"calories": 40.0, "protein": 1.9, "carbs": 8.8, "fat": 0.4, "unit": "g"},
    "Peppers (hot)": {"calories": 40.0, "protein": 1.9, "carbs": 8.8, "fat": 0.4, "unit": "g"},
    "Peppers, Sweet & Hot": {"calories": 30.0, "protein": 1.2, "carbs": 6.5, "fat": 0.2, "unit": "g"},
    "Peppers (sweet)": {"calories": 20.0, "protein": 0.9, "carbs": 4.6, "fat": 0.2, "unit": "g"},
    "Potatoes": {"calories": 77.0, "protein": 2.0, "carbs": 17.5, "fat": 0.1, "unit": "g"},
    "Potatoes, White": {"calories": 77.0, "protein": 2.0, "carbs": 17.5, "fat": 0.1, "unit": "g"},
    "Pumpkin": {"calories": 26.0, "protein": 1.0, "carbs": 6.5, "fat": 0.1, "unit": "g"},
    "Radishes": {"calories": 16.0, "protein": 0.7, "carbs": 3.4, "fat": 0.1, "unit": "g"},
    "Radishes (cooked)": {"calories": 14.0, "protein": 0.6, "carbs": 3.0, "fat": 0.1, "unit": "g"},
    "Radishes (raw)": {"calories": 16.0, "protein": 0.7, "carbs": 3.4, "fat": 0.1, "unit": "g"},
    "Rutabaga": {"calories": 38.0, "protein": 1.1, "carbs": 8.6, "fat": 0.2, "unit": "g"},
    "Rutabega": {"calories": 38.0, "protein": 1.1, "carbs": 8.6, "fat": 0.2, "unit": "g"},
    "Spaghetti Squash": {"calories": 31.0, "protein": 0.6, "carbs": 7.0, "fat": 0.6, "unit": "g"},
    "Spinach": {"calories": 23.0, "protein": 2.9, "carbs": 3.6, "fat": 0.4, "unit": "g"},
    "Spinach, Cooked": {"calories": 23.0, "protein": 3.0, "carbs": 3.7, "fat": 0.3, "unit": "g"},
    "Spinach, Raw": {"calories": 23.0, "protein": 2.9, "carbs": 3.6, "fat": 0.4, "unit": "g"},
    "Spinach (raw)": {"calories": 23.0, "protein": 2.9, "carbs": 3.6, "fat": 0.4, "unit": "g"},
    "Spinach (cooked)": {"calories": 23.0, "protein": 3.0, "carbs": 3.7, "fat": 0.3, "unit": "g"},
    "Sprouts": {"calories": 30.0, "protein": 3.8, "carbs": 5.9, "fat": 0.7, "unit": "g"},
    "Sprouts (not spicy)": {"calories": 30.0, "protein": 3.8, "carbs": 5.9, "fat": 0.7, "unit": "g"},
    "Squash, Summer": {"calories": 16.0, "protein": 1.2, "carbs": 3.4, "fat": 0.2, "unit": "g"},
    "Squash, Winter": {"calories": 34.0, "protein": 0.9, "carbs": 8.6, "fat": 0.1, "unit": "g"},
    "Sweet Potatoes": {"calories": 86.0, "protein": 1.6, "carbs": 20.1, "fat": 0.1, "unit": "g"},
    "Tomatoes": {"calories": 18.0, "protein": 0.9, "carbs": 3.9, "fat": 0.2, "unit": "g"},
    "Tomatoes (cooked)": {"calories": 20.0, "protein": 1.0, "carbs": 4.5, "fat": 0.2, "unit": "g"},
    "Tomatoes (raw)": {"calories": 18.0, "protein": 0.9, "carbs": 3.9, "fat": 0.2, "unit": "g"},
    "Turnips": {"calories": 28.0, "protein": 0.9, "carbs": 6.4, "fat": 0.1, "unit": "g"},
    "Turnip greens": {"calories": 32.0, "protein": 1.5, "carbs": 7.1, "fat": 0.3, "unit": "g"},
    "Watercress": {"calories": 11.0, "protein": 2.3, "carbs": 1.3, "fat": 0.1, "unit": "g"},
    "Wheat Grass": {"calories": 20.0, "protein": 1.7, "carbs": 1.7, "fat": 0.3, "unit": "g"},
    "Zucchini": {"calories": 17.0, "protein": 1.2, "carbs": 3.1, "fat": 0.3, "unit": "g"},
    "Amaranth": {"calories": 371.0, "protein": 13.6, "carbs": 65.3, "fat": 7.0, "unit": "g"},
    "Barley": {"calories": 354.0, "protein": 12.5, "carbs": 73.5, "fat": 2.3, "unit": "g"},
    "Buckwheat": {"calories": 343.0, "protein": 13.3, "carbs": 71.5, "fat": 3.4, "unit": "g"},
    "Cereals (cold, dry, or puffed)": {"calories": 370.0, "protein": 8.0, "carbs": 80.0, "fat": 2.0, "unit": "g"},
    "Cereal (dry)": {"calories": 370.0, "protein": 8.0, "carbs": 80.0, "fat": 2.0, "unit": "g"},
    "Cereal (unsweetened, cold, dry)": {"calories": 370.0, "protein": 8.0, "carbs": 80.0, "fat": 2.0, "unit": "g"},
    "Couscous": {"calories": 376.0, "protein": 12.8, "carbs": 77.4, "fat": 0.6, "unit": "g"},
    "Crackers": {"calories": 450.0, "protein": 10.0, "carbs": 70.0, "fat": 15.0, "unit": "g"},
    "Durham Flour": {"calories": 360.0, "protein": 13.7, "carbs": 72.8, "fat": 2.5, "unit": "g"},
    "Granola": {"calories": 471.0, "protein": 10.1, "carbs": 64.1, "fat": 20.0, "unit": "g"},
    "Millet": {"calories": 378.0, "protein": 11.0, "carbs": 72.9, "fat": 4.2, "unit": "g"},
    "Muesli": {"calories": 380.0, "protein": 10.0, "carbs": 68.0, "fat": 8.0, "unit": "g"},
    "Oats, Cooked": {"calories": 68.0, "protein": 2.4, "carbs": 12.0, "fat": 1.4, "unit": "g"},
    "Oats, Dry": {"calories": 389.0, "protein": 16.9, "carbs": 66.3, "fat": 6.9, "unit": "g"},
    "Oats (cooked)": {"calories": 68.0, "protein": 2.4, "carbs": 12.0, "fat": 1.4, "unit": "g"},
    "Oats (dry)": {"calories": 389.0, "protein": 16.9, "carbs": 66.3, "fat": 6.9, "unit": "g"},
    "Oats": {"calories": 389.0, "protein": 16.9, "carbs": 66.3, "fat": 6.9, "unit": "g"},
    "Oat Bran": {"calories": 246.0, "protein": 17.3, "carbs": 66.2, "fat": 7.0, "unit": "g"},
    "Pancakes": {"calories": 227.0, "protein": 6.4, "carbs": 39.5, "fat": 4.6, "unit": "g"},
    "Pasta": {"calories": 371.0, "protein": 13.0, "carbs": 74.7, "fat": 1.5, "unit": "g"},
    "Pasta, Wheat": {"calories": 350.0, "protein": 12.5, "carbs": 71.0, "fat": 1.5, "unit": "g"},
    "Polenta": {"calories": 383.0, "protein": 8.1, "carbs": 79.0, "fat": 1.9, "unit": "g"},
    "Quinoa": {"calories": 368.0, "protein": 14.1, "carbs": 64.2, "fat": 6.1, "unit": "g"},
    "Rice (all types)": {"calories": 360.0, "protein": 7.0, "carbs": 79.0, "fat": 0.6, "unit": "g"},
    "Rice (basmati, white, wild)": {"calories": 350.0, "protein": 7.5, "carbs": 77.0, "fat": 0.5, "unit": "g"},
    "Rice (brown, white)": {"calories": 362.0, "protein": 7.5, "carbs": 77.2, "fat": 2.7, "unit": "g"},
    "Rice (brown)": {"calories": 370.0, "protein": 7.9, "carbs": 77.2, "fat": 2.9, "unit": "g"},
    "Rice Cakes": {"calories": 388.0, "protein": 8.4, "carbs": 81.8, "fat": 3.2, "unit": "g"},
    "Rye": {"calories": 338.0, "protein": 10.3, "carbs": 75.9, "fat": 1.6, "unit": "g"},
    "Seitan": {"calories": 370.0, "protein": 75.0, "carbs": 14.0, "fat": 1.9, "unit": "g"},
    "Spelt": {"calories": 338.0, "protein": 14.6, "carbs": 70.2, "fat": 2.4, "unit": "g"},
    "Sprouted Wheat Bread": {"calories": 250.0, "protein": 10.0, "carbs": 45.0, "fat": 2.5, "unit": "g"},
    "Tapioca": {"calories": 358.0, "protein": 0.2, "carbs": 88.7, "fat": 0.0, "unit": "g"},
    "Wheat": {"calories": 327.0, "protein": 12.6, "carbs": 71.2, "fat": 1.5, "unit": "g"},
    "Wheat Bran": {"calories": 216.0, "protein": 15.6, "carbs": 64.5, "fat": 4.3, "unit": "g"},
    "Yeasted Bread": {"calories": 265.0, "protein": 9.0, "carbs": 49.0, "fat": 3.2, "unit": "g"},
    "Adzuki Beans": {"calories": 329.0, "protein": 19.9, "carbs": 62.9, "fat": 0.5, "unit": "g"},
    "Black Beans": {"calories": 341.0, "protein": 21.6, "carbs": 62.4, "fat": 1.4, "unit": "g"},
    "Black-Eyed Peas": {"calories": 336.0, "protein": 23.5, "carbs": 60.0, "fat": 1.3, "unit": "g"},
    "Garbanzo Beans (Chickpeas)": {"calories": 364.0, "protein": 19.3, "carbs": 60.7, "fat": 6.0, "unit": "g"},
    "Kidney Beans": {"calories": 333.0, "protein": 24.0, "carbs": 60.0, "fat": 0.8, "unit": "g"},
    "Lentils": {"calories": 353.0, "protein": 25.8, "carbs": 60.1, "fat": 1.1, "unit": "g"},
    "Lentils, Red": {"calories": 350.0, "protein": 24.0, "carbs": 63.0, "fat": 1.0, "unit": "g"},
    "Lentils, Brown": {"calories": 353.0, "protein": 25.8, "carbs": 60.1, "fat": 1.1, "unit": "g"},
    "Lima Beans": {"calories": 338.0, "protein": 21.5, "carbs": 63.4, "fat": 0.7, "unit": "g"},
    "Miso": {"calories": 199.0, "protein": 11.7, "carbs": 26.5, "fat": 6.0, "unit": "g"},
    "Mung Beans": {"calories": 347.0, "protein": 23.9, "carbs": 62.6, "fat": 1.2, "unit": "g"},
    "Mung Dal, Split": {"calories": 350.0, "protein": 25.0, "carbs": 60.0, "fat": 1.2, "unit": "g"},
    "Mung Dal": {"calories": 350.0, "protein": 25.0, "carbs": 60.0, "fat": 1.2, "unit": "g"},
    "Navy Beans": {"calories": 337.0, "protein": 22.3, "carbs": 61.3, "fat": 1.5, "unit": "g"},
    "Pinto Beans": {"calories": 347.0, "protein": 21.4, "carbs": 62.6, "fat": 1.2, "unit": "g"},
    "Soy Beans": {"calories": 446.0, "protein": 36.5, "carbs": 30.2, "fat": 19.9, "unit": "g"},
    "Soy Cheese": {"calories": 300.0, "protein": 18.0, "carbs": 8.0, "fat": 20.0, "unit": "g"},
    "Soy Flour": {"calories": 430.0, "protein": 35.0, "carbs": 38.0, "fat": 20.0, "unit": "g"},
    "Soy Milk": {"calories": 54.0, "protein": 3.3, "carbs": 5.7, "fat": 1.8, "unit": "g"},
    "Soy Milk (served warm)": {"calories": 54.0, "protein": 3.3, "carbs": 5.7, "fat": 1.8, "unit": "g"},
    "Soy Meats": {"calories": 120.0, "protein": 18.0, "carbs": 7.0, "fat": 2.0, "unit": "g"},
    "Soy Powder": {"calories": 400.0, "protein": 38.0, "carbs": 30.0, "fat": 18.0, "unit": "g"},
    "Soy Sauce": {"calories": 53.0, "protein": 8.1, "carbs": 5.6, "fat": 0.1, "unit": "g"},
    "Split Peas": {"calories": 341.0, "protein": 24.6, "carbs": 60.4, "fat": 1.2, "unit": "g"},
    "Tempeh": {"calories": 193.0, "protein": 18.5, "carbs": 9.4, "fat": 10.8, "unit": "g"},
    "Tofu": {"calories": 76.0, "protein": 8.1, "carbs": 1.9, "fat": 4.8, "unit": "g"},
    "Tofu (served hot)": {"calories": 76.0, "protein": 8.1, "carbs": 1.9, "fat": 4.8, "unit": "g"},
    "Tofu (served cold)": {"calories": 76.0, "protein": 8.1, "carbs": 1.9, "fat": 4.8, "unit": "g"},
    "Toor Dal": {"calories": 343.0, "protein": 21.7, "carbs": 63.0, "fat": 1.5, "unit": "g"},
    "Urad Dal": {"calories": 341.0, "protein": 25.2, "carbs": 58.9, "fat": 1.6, "unit": "g"},
    "White Beans": {"calories": 333.0, "protein": 23.4, "carbs": 60.3, "fat": 0.9, "unit": "g"},
    "Butter": {"calories": 717.0, "protein": 0.9, "carbs": 0.1, "fat": 81.1, "unit": "g"},
    "Butter (unsalted)": {"calories": 717.0, "protein": 0.9, "carbs": 0.1, "fat": 81.1, "unit": "g"},
    "Butter (salted)": {"calories": 717.0, "protein": 0.9, "carbs": 0.1, "fat": 81.1, "unit": "g"},
    "Buttermilk": {"calories": 40.0, "protein": 3.3, "carbs": 4.8, "fat": 0.9, "unit": "g"},
    "Cheese": {"calories": 402.0, "protein": 25.0, "carbs": 1.3, "fat": 33.1, "unit": "g"},
    "Cheese (soft, unsalted, not aged)": {"calories": 300.0, "protein": 15.0, "carbs": 3.0, "fat": 25.0, "unit": "g"},
    "Cheese (hard)": {"calories": 402.0, "protein": 25.0, "carbs": 1.3, "fat": 33.1, "unit": "g"},
    "Cottage Cheese": {"calories": 98.0, "protein": 11.1, "carbs": 3.4, "fat": 4.3, "unit": "g"},
    "Cottage Cheese (ideally from skim goat\u2019s milk)": {"calories": 72.0, "protein": 10.0, "carbs": 3.0, "fat": 2.0, "unit": "g"},
    "Cow\u2019s Milk": {"calories": 61.0, "protein": 3.2, "carbs": 4.8, "fat": 3.3, "unit": "g"},
    "Almond Milk": {"calories": 13.0, "protein": 0.4, "carbs": 0.6, "fat": 1.1, "unit": "g"},
    "Rice Milk": {"calories": 47.0, "protein": 0.3, "carbs": 9.2, "fat": 1.0, "unit": "g"},
    "Oat Milk": {"calories": 45.0, "protein": 0.3, "carbs": 8.0, "fat": 1.5, "unit": "g"},
    "Ghee": {"calories": 898.0, "protein": 0.0, "carbs": 0.0, "fat": 99.8, "unit": "g"},
    "Goat\u2019s Milk": {"calories": 69.0, "protein": 3.6, "carbs": 4.5, "fat": 4.1, "unit": "g"},
    "Goat\u2019s Milk (skim)": {"calories": 42.0, "protein": 3.7, "carbs": 4.6, "fat": 0.8, "unit": "g"},
    "Goat\u2019s Cheese (soft, unsalted)": {"calories": 364.0, "protein": 21.6, "carbs": 0.1, "fat": 29.8, "unit": "g"},
    "Goat\u2019s Cheese (unsalted, not aged)": {"calories": 364.0, "protein": 21.6, "carbs": 0.1, "fat": 29.8, "unit": "g"},
    "Ice Cream": {"calories": 207.0, "protein": 3.5, "carbs": 23.6, "fat": 11.0, "unit": "g"},
    "Ice Cream (in moderation)": {"calories": 207.0, "protein": 3.5, "carbs": 23.6, "fat": 11.0, "unit": "g"},
    "Sour Cream": {"calories": 198.0, "protein": 2.4, "carbs": 4.6, "fat": 19.4, "unit": "g"},
    "Sour Cream (in moderation)": {"calories": 198.0, "protein": 2.4, "carbs": 4.6, "fat": 19.4, "unit": "g"},
    "Yogurt (fresh)": {"calories": 61.0, "protein": 3.5, "carbs": 4.7, "fat": 3.3, "unit": "g"},
    "Yogurt (homemade, diluted, without fruit)": {"calories": 50.0, "protein": 3.0, "carbs": 4.0, "fat": 2.5, "unit": "g"},
    "Yogurt (store-bought or with fruit)": {"calories": 90.0, "protein": 3.8, "carbs": 15.0, "fat": 1.7, "unit": "g"},
    "Yogurt (store-bought)": {"calories": 90.0, "protein": 3.8, "carbs": 15.0, "fat": 1.7, "unit": "g"},
    "Yogurt (fresh and diluted)": {"calories": 50.0, "protein": 3.0, "carbs": 4.0, "fat": 2.5, "unit": "g"},
    "Frozen Yogurt": {"calories": 159.0, "protein": 3.8, "carbs": 30.0, "fat": 2.5, "unit": "g"},
    "Powdered Milk": {"calories": 496.0, "protein": 26.3, "carbs": 38.4, "fat": 26.7, "unit": "g"},
    "Almonds": {"calories": 579.0, "protein": 21.2, "carbs": 21.6, "fat": 49.9, "unit": "g"},
    "Almonds (soaked and peeled)": {"calories": 579.0, "protein": 21.2, "carbs": 21.6, "fat": 49.9, "unit": "g"},
    "Almonds (with skin)": {"calories": 579.0, "protein": 21.2, "carbs": 21.6, "fat": 49.9, "unit": "g"},
    "Brazil Nuts": {"calories": 656.0, "protein": 14.3, "carbs": 12.3, "fat": 66.3, "unit": "g"},
    "Cashews": {"calories": 553.0, "protein": 18.2, "carbs": 30.2, "fat": 43.9, "unit": "g"},
    "Charole Nuts": {"calories": 600.0, "protein": 20.0, "carbs": 15.0, "fat": 50.0, "unit": "g"},
    "Charoli Nuts": {"calories": 600.0, "protein": 20.0, "carbs": 15.0, "fat": 50.0, "unit": "g"},
    "Chia Seeds": {"calories": 486.0, "protein": 16.5, "carbs": 42.1, "fat": 30.7, "unit": "g"},
    "Filberts": {"calories": 628.0, "protein": 15.0, "carbs": 16.7, "fat": 60.8, "unit": "g"},
    "Flax Seeds": {"calories": 534.0, "protein": 18.3, "carbs": 28.9, "fat": 42.2, "unit": "g"},
    "Halva": {"calories": 500.0, "protein": 12.0, "carbs": 50.0, "fat": 25.0, "unit": "g"},
    "Hazelnuts": {"calories": 628.0, "protein": 15.0, "carbs": 16.7, "fat": 60.8, "unit": "g"},
    "Macadamia Nuts": {"calories": 718.0, "protein": 7.9, "carbs": 13.8, "fat": 75.8, "unit": "g"},
    "Peanuts": {"calories": 567.0, "protein": 25.8, "carbs": 16.1, "fat": 49.2, "unit": "g"},
    "Pecans": {"calories": 691.0, "protein": 9.2, "carbs": 13.9, "fat": 72.0, "unit": "g"},
    "Pine nuts": {"calories": 673.0, "protein": 13.7, "carbs": 13.1, "fat": 68.4, "unit": "g"},
    "Pine Nuts": {"calories": 673.0, "protein": 13.7, "carbs": 13.1, "fat": 68.4, "unit": "g"},
    "Pistachios": {"calories": 562.0, "protein": 20.3, "carbs": 27.5, "fat": 45.3, "unit": "g"},
    "Popcorn": {"calories": 387.0, "protein": 12.9, "carbs": 77.9, "fat": 4.5, "unit": "g"},
    "Popcorn (buttered, without salt)": {"calories": 450.0, "protein": 10.0, "carbs": 70.0, "fat": 15.0, "unit": "g"},
    "Popcorn (without salt or butter)": {"calories": 387.0, "protein": 12.9, "carbs": 77.9, "fat": 4.5, "unit": "g"},
    "Pumpkin Seeds": {"calories": 559.0, "protein": 30.2, "carbs": 10.7, "fat": 49.1, "unit": "g"},
    "Sesame Seeds": {"calories": 573.0, "protein": 17.7, "carbs": 23.5, "fat": 49.7, "unit": "g"},
    "Sunflower Seeds": {"calories": 584.0, "protein": 20.8, "carbs": 20.0, "fat": 51.5, "unit": "g"},
    "Tahini": {"calories": 595.0, "protein": 17.0, "carbs": 21.2, "fat": 53.8, "unit": "g"},
    "Walnuts": {"calories": 654.0, "protein": 15.2, "carbs": 13.7, "fat": 65.2, "unit": "g"},
    "Walnut": {"calories": 654.0, "protein": 15.2, "carbs": 13.7, "fat": 65.2, "unit": "g"},
    "Beef": {"calories": 250.0, "protein": 26.0, "carbs": 0.0, "fat": 15.0, "unit": "g"},
    "Buffalo": {"calories": 109.0, "protein": 21.3, "carbs": 0.0, "fat": 2.4, "unit": "g"},
    "Chicken": {"calories": 239.0, "protein": 27.0, "carbs": 0.0, "fat": 14.0, "unit": "g"},
    "Chicken (especially dark)": {"calories": 284.0, "protein": 20.1, "carbs": 0.0, "fat": 21.9, "unit": "g"},
    "Chicken (white)": {"calories": 165.0, "protein": 31.0, "carbs": 0.0, "fat": 3.6, "unit": "g"},
    "Chicken (dark)": {"calories": 284.0, "protein": 20.1, "carbs": 0.0, "fat": 21.9, "unit": "g"},
    "Duck": {"calories": 337.0, "protein": 19.0, "carbs": 0.0, "fat": 28.4, "unit": "g"},
    "Eggs": {"calories": 155.0, "protein": 12.6, "carbs": 1.1, "fat": 10.6, "unit": "g"},
    "Eggs (white only)": {"calories": 52.0, "protein": 10.9, "carbs": 0.7, "fat": 0.2, "unit": "g"},
    "Eggs (yolk)": {"calories": 322.0, "protein": 15.9, "carbs": 3.6, "fat": 26.5, "unit": "g"},
    "Eggs (not fried, and in moderation)": {"calories": 155.0, "protein": 12.6, "carbs": 1.1, "fat": 10.6, "unit": "g"},
    "Fish (fresh and saltwater)": {"calories": 150.0, "protein": 22.0, "carbs": 0.0, "fat": 6.0, "unit": "g"},
    "Fish (freshwater)": {"calories": 120.0, "protein": 20.0, "carbs": 0.0, "fat": 4.0, "unit": "g"},
    "Fish (saltwater)": {"calories": 180.0, "protein": 25.0, "carbs": 0.0, "fat": 8.0, "unit": "g"},
    "Lamb": {"calories": 294.0, "protein": 25.0, "carbs": 0.0, "fat": 21.0, "unit": "g"},
    "Mutton": {"calories": 294.0, "protein": 25.0, "carbs": 0.0, "fat": 21.0, "unit": "g"},
    "Pork": {"calories": 242.0, "protein": 27.0, "carbs": 0.0, "fat": 14.0, "unit": "g"},
    "Rabbit": {"calories": 173.0, "protein": 33.0, "carbs": 0.0, "fat": 3.5, "unit": "g"},
    "Salmon": {"calories": 208.0, "protein": 20.0, "carbs": 0.0, "fat": 13.0, "unit": "g"},
    "Sardines": {"calories": 208.0, "protein": 24.6, "carbs": 0.0, "fat": 11.5, "unit": "g"},
    "Seafood": {"calories": 100.0, "protein": 18.0, "carbs": 1.0, "fat": 2.0, "unit": "g"},
    "Shrimp": {"calories": 99.0, "protein": 24.0, "carbs": 0.2, "fat": 0.3, "unit": "g"},
    "Tuna Fish": {"calories": 130.0, "protein": 29.0, "carbs": 0.0, "fat": 0.6, "unit": "g"},
    "Turkey (dark)": {"calories": 189.0, "protein": 28.0, "carbs": 0.0, "fat": 7.0, "unit": "g"},
    "Turkey (white)": {"calories": 189.0, "protein": 29.0, "carbs": 0.1, "fat": 7.2, "unit": "g"},
    "Venison": {"calories": 158.0, "protein": 30.0, "carbs": 0.0, "fat": 3.2, "unit": "g"},
    "Almond Oil": {"calories": 884.0, "protein": 0.0, "carbs": 0.0, "fat": 100.0, "unit": "g"},
    "Apricot Oil": {"calories": 884.0, "protein": 0.0, "carbs": 0.0, "fat": 100.0, "unit": "g"},
    "Avocado Oil": {"calories": 884.0, "protein": 0.0, "carbs": 0.0, "fat": 100.0, "unit": "g"},
    "Canola Oil": {"calories": 884.0, "protein": 0.0, "carbs": 0.0, "fat": 100.0, "unit": "g"},
    "Castor Oil": {"calories": 884.0, "protein": 0.0, "carbs": 0.0, "fat": 100.0, "unit": "g"},
    "Coconut Oil": {"calories": 862.0, "protein": 0.0, "carbs": 0.0, "fat": 100.0, "unit": "g"},
    "Corn Oil": {"calories": 884.0, "protein": 0.0, "carbs": 0.0, "fat": 100.0, "unit": "g"},
    "Flax Seed Oil": {"calories": 884.0, "protein": 0.0, "carbs": 0.0, "fat": 100.0, "unit": "g"},
    "Mustard Oil": {"calories": 884.0, "protein": 0.0, "carbs": 0.0, "fat": 100.0, "unit": "g"},
    "Olive Oil": {"calories": 884.0, "protein": 0.0, "carbs": 0.0, "fat": 100.0, "unit": "g"},
    "Peanut Oil": {"calories": 884.0, "protein": 0.0, "carbs": 0.0, "fat": 100.0, "unit": "g"},
    "Primrose Oil": {"calories": 884.0, "protein": 0.0, "carbs": 0.0, "fat": 100.0, "unit": "g"},
    "Safflower Oil": {"calories": 884.0, "protein": 0.0, "carbs": 0.0, "fat": 100.0, "unit": "g"},
    "Sesame Oil": {"calories": 884.0, "protein": 0.0, "carbs": 0.0, "fat": 100.0, "unit": "g"},
    "Soy Oil": {"calories": 884.0, "protein": 0.0, "carbs": 0.0, "fat": 100.0, "unit": "g"},
    "Sunflower Oil": {"calories": 884.0, "protein": 0.0, "carbs": 0.0, "fat": 100.0, "unit": "g"},
    "Walnut Oil": {"calories": 884.0, "protein": 0.0, "carbs": 0.0, "fat": 100.0, "unit": "g"},
    "Artificial Sweeteners": {"calories": 0.0, "protein": 0.0, "carbs": 0.0, "fat": 0.0, "unit": "g"},
    "Barley Malt": {"calories": 300.0, "protein": 5.0, "carbs": 75.0, "fat": 0.0, "unit": "g"},
    "Date Sugar": {"calories": 300.0, "protein": 2.0, "carbs": 75.0, "fat": 0.0, "unit": "g"},
    "Fructose": {"calories": 368.0, "protein": 0.0, "carbs": 100.0, "fat": 0.0, "unit": "g"},
    "Fruit Juice Concentrates": {"calories": 280.0, "protein": 0.5, "carbs": 70.0, "fat": 0.0, "unit": "g"},
    "Honey (raw)": {"calories": 304.0, "protein": 0.3, "carbs": 82.4, "fat": 0.0, "unit": "g"},
    "Honey (raw and unprocessed)": {"calories": 304.0, "protein": 0.3, "carbs": 82.4, "fat": 0.0, "unit": "g"},
    "Honey": {"calories": 304.0, "protein": 0.3, "carbs": 82.4, "fat": 0.0, "unit": "g"},
    "Honey (heated or cooked)": {"calories": 304.0, "protein": 0.3, "carbs": 82.4, "fat": 0.0, "unit": "g"},
    "Honey (cooked, heated, or processed)": {"calories": 304.0, "protein": 0.3, "carbs": 82.4, "fat": 0.0, "unit": "g"},
    "Jaggary": {"calories": 383.0, "protein": 0.4, "carbs": 98.0, "fat": 0.1, "unit": "g"},
    "Maple Syrup": {"calories": 260.0, "protein": 0.0, "carbs": 67.0, "fat": 0.1, "unit": "g"},
    "Maple Syrup (in moderation)": {"calories": 260.0, "protein": 0.0, "carbs": 67.0, "fat": 0.1, "unit": "g"},
    "Molasses": {"calories": 290.0, "protein": 0.0, "carbs": 74.7, "fat": 0.1, "unit": "g"},
    "Rice Syrup": {"calories": 316.0, "protein": 0.5, "carbs": 78.0, "fat": 0.2, "unit": "g"},
    "Sucanat": {"calories": 380.0, "protein": 0.0, "carbs": 95.0, "fat": 0.0, "unit": "g"},
    "Turbinado": {"calories": 399.0, "protein": 0.0, "carbs": 99.8, "fat": 0.0, "unit": "g"},
    "White Sugar": {"calories": 387.0, "protein": 0.0, "carbs": 100.0, "fat": 0.0, "unit": "g"},
    "Ajwan": {"calories": 305.0, "protein": 16.0, "carbs": 43.0, "fat": 25.0, "unit": "g"},
    "Allspice": {"calories": 263.0, "protein": 6.1, "carbs": 72.1, "fat": 8.7, "unit": "g"},
    "Anise": {"calories": 337.0, "protein": 17.6, "carbs": 50.0, "fat": 15.9, "unit": "g"},
    "Asafoetida": {"calories": 296.0, "protein": 4.0, "carbs": 67.8, "fat": 1.0, "unit": "g"},
    "Basil": {"calories": 23.0, "protein": 3.2, "carbs": 2.7, "fat": 0.6, "unit": "g"},
    "Basil (fresh)": {"calories": 23.0, "protein": 3.2, "carbs": 2.7, "fat": 0.6, "unit": "g"},
    "Basil (dry)": {"calories": 251.0, "protein": 23.0, "carbs": 61.0, "fat": 4.0, "unit": "g"},
    "Bay Leaf": {"calories": 313.0, "protein": 7.6, "carbs": 75.0, "fat": 8.4, "unit": "g"},
    "Black Pepper": {"calories": 251.0, "protein": 10.4, "carbs": 63.9, "fat": 3.3, "unit": "g"},
    "Black Pepper (small amounts)": {"calories": 251.0, "protein": 10.4, "carbs": 63.9, "fat": 3.3, "unit": "g"},
    "Caraway": {"calories": 333.0, "protein": 19.8, "carbs": 49.9, "fat": 14.6, "unit": "g"},
    "Cardamom": {"calories": 311.0, "protein": 10.8, "carbs": 68.5, "fat": 6.7, "unit": "g"},
    "Cayenne": {"calories": 318.0, "protein": 12.0, "carbs": 56.6, "fat": 17.3, "unit": "g"},
    "Cayenne Pepper": {"calories": 318.0, "protein": 12.0, "carbs": 56.6, "fat": 17.3, "unit": "g"},
    "Chili Powder": {"calories": 282.0, "protein": 13.5, "carbs": 49.8, "fat": 14.3, "unit": "g"},
    "Cinnamon": {"calories": 247.0, "protein": 4.0, "carbs": 80.6, "fat": 1.2, "unit": "g"},
    "Cinnamon (small amounts)": {"calories": 247.0, "protein": 4.0, "carbs": 80.6, "fat": 1.2, "unit": "g"},
    "Cloves": {"calories": 274.0, "protein": 6.0, "carbs": 65.5, "fat": 13.0, "unit": "g"},
    "Coriander (seeds or powder)": {"calories": 298.0, "protein": 12.4, "carbs": 55.0, "fat": 17.8, "unit": "g"},
    "Cumin (seeds or powder)": {"calories": 375.0, "protein": 17.8, "carbs": 44.2, "fat": 22.3, "unit": "g"},
    "Dill": {"calories": 43.0, "protein": 3.5, "carbs": 7.0, "fat": 1.1, "unit": "g"},
    "Fennel": {"calories": 345.0, "protein": 15.8, "carbs": 52.3, "fat": 14.9, "unit": "g"},
    "Fenugreek": {"calories": 323.0, "protein": 23.0, "carbs": 58.4, "fat": 6.4, "unit": "g"},
    "Ginger (fresh or dried)": {"calories": 80.0, "protein": 1.8, "carbs": 17.8, "fat": 0.8, "unit": "g"},
    "Ginger (fresh)": {"calories": 80.0, "protein": 1.8, "carbs": 17.8, "fat": 0.8, "unit": "g"},
    "Ginger (dry)": {"calories": 335.0, "protein": 9.0, "carbs": 71.6, "fat": 4.2, "unit": "g"},
    "Hing (Asafoetida)": {"calories": 296.0, "protein": 4.0, "carbs": 67.8, "fat": 1.0, "unit": "g"},
    "Mace": {"calories": 475.0, "protein": 6.7, "carbs": 50.5, "fat": 32.4, "unit": "g"},
    "Marjoram": {"calories": 271.0, "protein": 12.7, "carbs": 60.6, "fat": 7.0, "unit": "g"},
    "Mint": {"calories": 70.0, "protein": 3.8, "carbs": 14.9, "fat": 0.9, "unit": "g"},
    "Mustard Seeds": {"calories": 508.0, "protein": 26.1, "carbs": 28.1, "fat": 36.2, "unit": "g"},
    "Neem Leaves": {"calories": 45.0, "protein": 2.5, "carbs": 8.0, "fat": 0.1, "unit": "g"},
    "Nutmeg": {"calories": 525.0, "protein": 5.8, "carbs": 49.3, "fat": 36.3, "unit": "g"},
    "Oregano": {"calories": 265.0, "protein": 9.0, "carbs": 68.9, "fat": 4.3, "unit": "g"},
    "Orange Peel": {"calories": 97.0, "protein": 1.5, "carbs": 25.0, "fat": 0.2, "unit": "g"},
    "Paprika": {"calories": 282.0, "protein": 14.1, "carbs": 54.0, "fat": 12.9, "unit": "g"},
    "Peppermint": {"calories": 70.0, "protein": 3.8, "carbs": 14.8, "fat": 0.9, "unit": "g"},
    "Pippali": {"calories": 310.0, "protein": 11.0, "carbs": 65.0, "fat": 3.0, "unit": "g"},
    "Poppy Seeds": {"calories": 525.0, "protein": 18.0, "carbs": 28.1, "fat": 41.6, "unit": "g"},
    "Rosemary": {"calories": 131.0, "protein": 3.3, "carbs": 20.7, "fat": 5.9, "unit": "g"},
    "Saffron": {"calories": 310.0, "protein": 11.4, "carbs": 65.4, "fat": 5.9, "unit": "g"},
    "Sage": {"calories": 315.0, "protein": 10.6, "carbs": 60.7, "fat": 12.8, "unit": "g"},
    "Salt": {"calories": 0.0, "protein": 0.0, "carbs": 0.0, "fat": 0.0, "unit": "g"},
    "Salt (in excess)": {"calories": 0.0, "protein": 0.0, "carbs": 0.0, "fat": 0.0, "unit": "g"},
    "Savory": {"calories": 272.0, "protein": 6.8, "carbs": 68.7, "fat": 5.9, "unit": "g"},
    "Spearmint": {"calories": 44.0, "protein": 3.3, "carbs": 8.4, "fat": 0.7, "unit": "g"},
    "Tarragon": {"calories": 295.0, "protein": 22.8, "carbs": 50.2, "fat": 7.2, "unit": "g"},
    "Thyme": {"calories": 101.0, "protein": 5.6, "carbs": 24.5, "fat": 1.7, "unit": "g"},
    "Trikatu": {"calories": 300.0, "protein": 10.0, "carbs": 65.0, "fat": 5.0, "unit": "g"},
    "Turmeric": {"calories": 312.0, "protein": 9.7, "carbs": 67.1, "fat": 3.3, "unit": "g"},
    "Vanilla": {"calories": 288.0, "protein": 0.1, "carbs": 12.7, "fat": 0.1, "unit": "g"},
    "Wintergreen": {"calories": 0.0, "protein": 0.0, "carbs": 0.0, "fat": 0.0, "unit": "g"},
    "Blueberries": {"calories": 57.0, "protein": 0.7, "carbs": 14.5, "fat": 0.3, "unit": "g"},
    "Raspberries": {"calories": 52.0, "protein": 1.2, "carbs": 11.9, "fat": 0.7, "unit": "g"},
    "Strawberries": {"calories": 32.0, "protein": 0.7, "carbs": 7.7, "fat": 0.3, "unit": "g"},
    "Ash Gourd": {"calories": 13.0, "protein": 0.4, "carbs": 3.0, "fat": 0.2, "unit": "g"},
    "Bitter Gourd": {"calories": 17.0, "protein": 1.0, "carbs": 3.7, "fat": 0.2, "unit": "g"},
    "Bottle Gourd": {"calories": 14.0, "protein": 0.6, "carbs": 3.4, "fat": 0.0, "unit": "g"},
    "Brinjal": {"calories": 25.0, "protein": 1.0, "carbs": 5.9, "fat": 0.2, "unit": "g"},
    "Capsicum": {"calories": 20.0, "protein": 0.9, "carbs": 4.6, "fat": 0.2, "unit": "g"},
    "Cluster Beans": {"calories": 32.0, "protein": 3.2, "carbs": 10.8, "fat": 0.4, "unit": "g"},
    "Coriander Leaves": {"calories": 23.0, "protein": 2.1, "carbs": 3.7, "fat": 0.5, "unit": "g"},
    "Corn": {"calories": 86.0, "protein": 3.2, "carbs": 19.0, "fat": 1.2, "unit": "g"},
    "Cucumber": {"calories": 15.0, "protein": 0.7, "carbs": 3.6, "fat": 0.1, "unit": "g"},
    "Curry Leaves": {"calories": 108.0, "protein": 6.1, "carbs": 18.7, "fat": 1.0, "unit": "g"},
    "Drumstick": {"calories": 37.0, "protein": 2.1, "carbs": 8.5, "fat": 0.2, "unit": "g"},
    "Fenugreek Leaves": {"calories": 49.0, "protein": 4.4, "carbs": 6.0, "fat": 0.9, "unit": "g"},
    "Garlic": {"calories": 149.0, "protein": 6.4, "carbs": 33.1, "fat": 0.5, "unit": "g"},
    "Ginger": {"calories": 80.0, "protein": 1.8, "carbs": 17.8, "fat": 0.8, "unit": "g"},
    "Green Chillies": {"calories": 40.0, "protein": 2.0, "carbs": 9.5, "fat": 0.2, "unit": "g"},
    "Green Peas": {"calories": 81.0, "protein": 5.4, "carbs": 14.5, "fat": 0.4, "unit": "g"},
    "Lady Finger": {"calories": 33.0, "protein": 1.9, "carbs": 7.5, "fat": 0.2, "unit": "g"},
    "Mint Leaves": {"calories": 70.0, "protein": 3.8, "carbs": 14.9, "fat": 0.9, "unit": "g"},
    "Mustard Greens": {"calories": 27.0, "protein": 2.9, "carbs": 4.7, "fat": 0.4, "unit": "g"},
    "Onion": {"calories": 40.0, "protein": 1.1, "carbs": 9.3, "fat": 0.1, "unit": "g"},
    "Plantain": {"calories": 122.0, "protein": 1.3, "carbs": 31.9, "fat": 0.4, "unit": "g"},
    "Pointed Gourd": {"calories": 20.0, "protein": 2.0, "carbs": 4.0, "fat": 0.3, "unit": "g"},
    "Potato": {"calories": 77.0, "protein": 2.0, "carbs": 17.5, "fat": 0.1, "unit": "g"},
    "Pumpkin": {"calories": 26.0, "protein": 1.0, "carbs": 6.5, "fat": 0.1, "unit": "g"},
    "Radish": {"calories": 16.0, "protein": 0.7, "carbs": 3.4, "fat": 0.1, "unit": "g"},
    "Ridge Gourd": {"calories": 17.0, "protein": 0.5, "carbs": 3.4, "fat": 0.1, "unit": "g"},
    "Snake Gourd": {"calories": 18.0, "protein": 0.5, "carbs": 3.7, "fat": 0.3, "unit": "g"},
    "Spinach": {"calories": 23.0, "protein": 2.9, "carbs": 3.6, "fat": 0.4, "unit": "g"},
    "Spring Onion": {"calories": 32.0, "protein": 1.8, "carbs": 7.3, "fat": 0.2, "unit": "g"},
    "Sweet Potato": {"calories": 86.0, "protein": 1.6, "carbs": 20.1, "fat": 0.1, "unit": "g"},
    "Tindora": {"calories": 18.0, "protein": 1.2, "carbs": 3.1, "fat": 0.1, "unit": "g"},
    "Turnip": {"calories": 28.0, "protein": 0.9, "carbs": 6.4, "fat": 0.1, "unit": "g"},
    "Yam": {"calories": 118.0, "protein": 1.5, "carbs": 27.9, "fat": 0.2, "unit": "g"},
    "Barley": {"calories": 354.0, "protein": 12.5, "carbs": 73.5, "fat": 2.3, "unit": "g"},
    "Bulgur Wheat": {"calories": 342.0, "protein": 12.3, "carbs": 75.9, "fat": 1.3, "unit": "g"},
    "Cornmeal": {"calories": 362.0, "protein": 9.4, "carbs": 74.3, "fat": 3.9, "unit": "g"},
    "Millet": {"calories": 378.0, "protein": 11.0, "carbs": 72.9, "fat": 4.2, "unit": "g"},
    "Puffed Rice": {"calories": 402.0, "protein": 6.0, "carbs": 90.0, "fat": 0.5, "unit": "g"},
    "Rice": {"calories": 365.0, "protein": 7.1, "carbs": 80.0, "fat": 0.7, "unit": "g"},
    "Semolina": {"calories": 360.0, "protein": 12.7, "carbs": 72.8, "fat": 1.1, "unit": "g"},
    "Sorghum": {"calories": 339.0, "protein": 11.3, "carbs": 74.6, "fat": 3.3, "unit": "g"},
    "Wheat Flour": {"calories": 364.0, "protein": 10.3, "carbs": 76.3, "fat": 1.7, "unit": "g"},
    "Chickpeas": {"calories": 364.0, "protein": 19.3, "carbs": 60.7, "fat": 6.0, "unit": "g"},
    "Kidney Beans": {"calories": 333.0, "protein": 24.0, "carbs": 60.0, "fat": 0.8, "unit": "g"},
    "Lentils": {"calories": 353.0, "protein": 25.8, "carbs": 60.1, "fat": 1.1, "unit": "g"},
    "Mung Beans": {"calories": 347.0, "protein": 23.9, "carbs": 62.6, "fat": 1.2, "unit": "g"},
    "Soybeans": {"calories": 446.0, "protein": 36.5, "carbs": 30.2, "fat": 19.9, "unit": "g"},
    "Split Chickpeas": {"calories": 378.0, "protein": 20.8, "carbs": 61.5, "fat": 5.6, "unit": "g"},
    "Split Green Gram": {"calories": 347.0, "protein": 23.9, "carbs": 62.6, "fat": 1.2, "unit": "g"},
    "Split Pigeon Peas": {"calories": 343.0, "protein": 21.7, "carbs": 63.0, "fat": 1.5, "unit": "g"},
    "Split Red Lentils": {"calories": 350.0, "protein": 24.0, "carbs": 63.0, "fat": 1.0, "unit": "g"},
    "Whole Black Gram": {"calories": 341.0, "protein": 25.2, "carbs": 58.9, "fat": 1.6, "unit": "g"},
    "Buttermilk": {"calories": 40.0, "protein": 3.3, "carbs": 4.8, "fat": 0.9, "unit": "g"},
    "Cheese": {"calories": 402.0, "protein": 25.0, "carbs": 1.3, "fat": 33.1, "unit": "g"},
    "Cottage Cheese": {"calories": 265.0, "protein": 18.3, "carbs": 1.2, "fat": 20.8, "unit": "g"},
    "Cream": {"calories": 345.0, "protein": 2.1, "carbs": 2.8, "fat": 36.0, "unit": "g"},
    "Curd": {"calories": 61.0, "protein": 3.5, "carbs": 4.7, "fat": 3.3, "unit": "g"},
    "Milk": {"calories": 61.0, "protein": 3.2, "carbs": 4.8, "fat": 3.3, "unit": "g"},
    "Almonds": {"calories": 579.0, "protein": 21.2, "carbs": 21.6, "fat": 49.9, "unit": "g"},
    "Cashews": {"calories": 553.0, "protein": 18.2, "carbs": 30.2, "fat": 43.9, "unit": "g"},
    "Chia Seeds": {"calories": 486.0, "protein": 16.5, "carbs": 42.1, "fat": 30.7, "unit": "g"},
    "Flax Seeds": {"calories": 534.0, "protein": 18.3, "carbs": 28.9, "fat": 42.2, "unit": "g"},
    "Peanuts": {"calories": 567.0, "protein": 25.8, "carbs": 16.1, "fat": 49.2, "unit": "g"},
    "Pistachios": {"calories": 562.0, "protein": 20.3, "carbs": 27.5, "fat": 45.3, "unit": "g"},
    "Pumpkin Seeds": {"calories": 559.0, "protein": 30.2, "carbs": 10.7, "fat": 49.1, "unit": "g"},
    "Sesame Seeds": {"calories": 573.0, "protein": 17.7, "carbs": 23.5, "fat": 49.7, "unit": "g"},
    "Sunflower Seeds": {"calories": 584.0, "protein": 20.8, "carbs": 20.0, "fat": 51.5, "unit": "g"},
    "Walnuts": {"calories": 654.0, "protein": 15.2, "carbs": 13.7, "fat": 65.2, "unit": "g"},
    "Egg": {"calories": 155.0, "protein": 12.6, "carbs": 1.1, "fat": 10.6, "unit": "g"},
    "Fish": {"calories": 206.0, "protein": 22.0, "carbs": 0.0, "fat": 12.0, "unit": "g"},
    "Mutton": {"calories": 294.0, "protein": 25.0, "carbs": 0.0, "fat": 21.0, "unit": "g"},
    "Prawns": {"calories": 99.0, "protein": 24.0, "carbs": 0.2, "fat": 0.3, "unit": "g"},
    "Groundnut Oil": {"calories": 884.0, "protein": 0.0, "carbs": 0.0, "fat": 100.0, "unit": "g"},
    "Sesame Oil": {"calories": 884.0, "protein": 0.0, "carbs": 0.0, "fat": 100.0, "unit": "g"},
    "Honey": {"calories": 304.0, "protein": 0.3, "carbs": 82.4, "fat": 0.0, "unit": "g"},
    "Jaggery": {"calories": 383.0, "protein": 0.4, "carbs": 98.0, "fat": 0.1, "unit": "g"},
    "Sugar": {"calories": 387.0, "protein": 0.0, "carbs": 100.0, "fat": 0.0, "unit": "g"},
    "Asafoetida": {"calories": 296.0, "protein": 4.0, "carbs": 67.8, "fat": 1.0, "unit": "g"},
    "Bay Leaf": {"calories": 313.0, "protein": 7.6, "carbs": 75.0, "fat": 8.4, "unit": "g"},
    "Black Pepper": {"calories": 251.0, "protein": 10.4, "carbs": 63.9, "fat": 3.3, "unit": "g"},
    "Cardamom": {"calories": 311.0, "protein": 10.8, "carbs": 68.5, "fat": 6.7, "unit": "g"},
    "Cinnamon": {"calories": 247.0, "protein": 4.0, "carbs": 80.6, "fat": 1.2, "unit": "g"},
    "Cloves": {"calories": 274.0, "protein": 6.0, "carbs": 65.5, "fat": 13.0, "unit": "g"},
    "Coriander Powder": {"calories": 298.0, "protein": 12.4, "carbs": 55.0, "fat": 17.8, "unit": "g"},
    "Cumin Seeds": {"calories": 375.0, "protein": 17.8, "carbs": 44.2, "fat": 22.3, "unit": "g"},
    "Dry Mango Powder": {"calories": 353.0, "protein": 5.1, "carbs": 84.2, "fat": 1.6, "unit": "g"},
    "Fennel Seeds": {"calories": 345.0, "protein": 15.8, "carbs": 52.3, "fat": 14.9, "unit": "g"},
    "Fenugreek Seeds": {"calories": 323.0, "protein": 23.0, "carbs": 58.4, "fat": 6.4, "unit": "g"},
    "Garam Masala": {"calories": 300.0, "protein": 10.0, "carbs": 50.0, "fat": 15.0, "unit": "g"},
    "Mustard Seeds": {"calories": 508.0, "protein": 26.1, "carbs": 28.1, "fat": 36.2, "unit": "g"},
    "Nutmeg": {"calories": 525.0, "protein": 5.8, "carbs": 49.3, "fat": 36.3, "unit": "g"},
    "Poppy Seeds": {"calories": 525.0, "protein": 18.0, "carbs": 28.1, "fat": 41.6, "unit": "g"},
    "Red Chilli Powder": {"calories": 282.0, "protein": 13.5, "carbs": 49.8, "fat": 14.3, "unit": "g"},
    "Salt": {"calories": 0.0, "protein": 0.0, "carbs": 0.0, "fat": 0.0, "unit": "g"},
    "Tamarind Pulp": {"calories": 239.0, "protein": 2.8, "carbs": 62.5, "fat": 0.6, "unit": "g"},
    "Turmeric Powder": {"calories": 312.0, "protein": 9.7, "carbs": 67.1, "fat": 3.3, "unit": "g"},
    "Vinegar": {"calories": 18.0, "protein": 0.0, "carbs": 0.9, "fat": 0.0, "unit": "g"},
    "Default": {"calories": 0.0, "protein": 0.0, "carbs": 0.0, "fat": 0.0, "unit": "g", "note": "Default value - data not found or not applicable"}

            }
        }, // End dietPlannerData
        exerciseAdvisorData: {
            // THIS SECTION MUST BE FULLY POPULATED with the data from your AyurExer-CompleteCodes.txt 'appData' object.
            // Using the complete structure from the last working version.
            howToUseGuide: { title: "How to Use This Exercise Guide", notes: [ "Identify Your Dosha – Choose Vata, Pitta, or Kapha-based workouts.", "Follow Dosha-based Exercise Programs & Instructions.", "Pick Your Workout Type – Select from Regular, Passive (Recovery), or Intensive.", "Follow the Weekly Schedule – Adjust workouts based on your age & fitness level.", "Monitor Your THR – Ensure your cardio workouts align with safe heart rate zones." ] },
            thrInfo: { title: "Target Heart Rate (THR)", formula: "Formula: (220 - Age) × Desired Intensity (%)", exampleFormula: "(220 - Age) × Desired Percentage", whyItMatters: "Why it matters: THR ensures cardio exercises are performed at the right intensity for safe and effective workouts, preventing overexertion or under-training.", chartTitle: "Target Heart Rate (THR) Zones for Your Age Group", chart: [ { ageGroup: "10-19", light: "105-126 BPM", moderate: "126-158 BPM", intensive: "158-179 BPM" }, { ageGroup: "20-30", light: "100-120 BPM", moderate: "120-140 BPM", intensive: "140-160 BPM" }, { ageGroup: "31-40", light: "95-115 BPM", moderate: "115-135 BPM", intensive: "135-155 BPM" }, { ageGroup: "41-50", light: "90-110 BPM", moderate: "110-130 BPM", intensive: "130-150 BPM" }, { ageGroup: "51-55", light: "85-105 BPM", moderate: "105-125 BPM", intensive: "125-145 BPM" }, { ageGroup: "56-65", light: "80-100 BPM", moderate: "100-120 BPM", intensive: "120-140 BPM" }, { ageGroup: "66-75+", light: "75-95 BPM", moderate: "95-115 BPM", intensive: "115-135 BPM" } ] },
            weeklyFrequencyByAge: { title: "Personalized Weekly Workout Frequency", data: [ { ageGroup: "10-19", regular: "3-5 days", passive: "1-2 days", intensive: "1-2 days (sports, HIIT if appropriate for older teens)", rest: "1-2 days" }, { ageGroup: "20-30", regular: "3-4 days", passive: "1-2 days", intensive: "1-2 days (HIIT, Bootcamp, Circuit Training)", rest: "2-3 days" }, { ageGroup: "31-40", regular: "3-4 days", passive: "1-2 days", intensive: "1-2 days (HIIT, Bootcamp, Circuit Training)", rest: "1-2 days" }, { ageGroup: "41-50", regular: "3 days", passive: "2 days", intensive: "1-2 days (HIIT, Bootcamp, Circuit Training)", rest: "2 days" }, { ageGroup: "51-55", regular: "2-3 days", passive: "2-3 days", intensive: "1 day (Circuit Training alternative)", rest: "2-3 days" }, { ageGroup: "56-65", regular: "2 days", passive: "3-4 days", intensive: "1 day (Circuit Training alternative)", rest: "2-3 days" }, { ageGroup: "66-75+", regular: "1-2 days", passive: "4-5 days", intensive: "None (or very light, modified circuits)", rest: "2-3 days" } ] },
            workoutPlans: {
                regular: { title: "Table 1: Regular Workout", exercises: [ { exercise: "Cardio", gym: "Treadmill/Bike/Elliptical", home: "Walking, skipping, step-ups", sets: "1", reps: "20-30 min", thr: "50-70% THR" }, { exercise: "Upper Body Strength (Push)", gym: "Bench Press/Push-up Machine", home: "Push-ups (knees or full)", sets: "2-3", reps: "10-15", thr: "-" }, { exercise: "Upper Body Strength (Pull)", gym: "Lat Pull-Down Machine", home: "Resistance Bands Rows/Pull-ups (assisted or full)", sets: "2-3", reps: "10-15", thr: "-" }, { exercise: "Shoulder Press", gym: "Dumbbells/Machine", home: "Dumbbells/Pike Push-ups", sets: "2-3", reps: "12-15", thr: "-" }, { exercise: "Biceps Curls", gym: "Dumbbells/Cable", home: "Dumbbells/Resistance Bands", sets: "2-3", reps: "12-15", thr: "-" }, { exercise: "Triceps Extensions", gym: "Dumbbells/Cable Pushdown", home: "Chair Dips/Band Extensions", sets: "2-3", reps: "12-15", thr: "-" }, { exercise: "Lower Body Compound", gym: "Squats/Leg Press", home: "Bodyweight Squats/Lunges", sets: "2-3", reps: "12-15", thr: "-" }, { exercise: "Core Workout", gym: "Plank/Leg Raises/Cable Crunches", home: "Plank/Crunches/Leg Raises", sets: "2-3", reps: "15-20 or 30-60s hold", thr: "-" }, { exercise: "Flexibility", gym: "Whole-Body Stretching", home: "Whole-Body Stretching", sets: "-", reps: "10-15 min", thr: "-" } ] },
                intensive: { title: "Table 2: Intensive Workout (Group Classes OR Circuit Training Alternative)", description: "Choose either group classes OR the circuit training alternative. Do not combine on the same day unless very fit and Dosha appropriate.", groupClassesInfo: "Group Classes (e.g., HIIT, Bootcamp, Spinning, Zumba, Aerobics): Participate as per class structure, typically 45-60 minutes. Monitor THR.", circuitAlternative: { exercises: [ { exercise: "Warm-up Cardio", gym: "Treadmill/Bike/Elliptical", home: "Jumping Jacks, High Knees", sets: "1", reps: "5-10 min", thr: "Warm-up pace" }, { exercise: "Bodyweight Squats or Goblet Squats", gym: "Dumbbell/Kettlebell", home: "Bodyweight", sets: "1 circuit set", reps: "15-20", thr: "Elevated" }, { exercise: "Push-ups (any variation)", gym: "Floor", home: "Floor/Wall", sets: "1 circuit set", reps: "10-15", thr: "Elevated" }, { exercise: "Resistance Band Rows or Dumbbell Rows", gym: "Dumbbells", home: "Resistance Bands", sets: "1 circuit set", reps: "12-15 per side", thr: "Elevated" }, { exercise: "Plank", gym: "Floor", home: "Floor", sets: "1 circuit set", reps: "30-60 seconds", thr: "Elevated" }, { exercise: "Lunges (alternating)", gym: "Bodyweight/Dumbbells", home: "Bodyweight", sets: "1 circuit set", reps: "10-12 per leg", thr: "Elevated" } ], circuitInstructions: [ "Perform each exercise in the circuit back-to-back with minimal (15-30 seconds) or no rest.", "After completing all exercises in one circuit, rest for 1-2 minutes.", "Repeat the circuit 2-4 times depending on fitness level and Dosha type (Vata less, Kapha more).", "Cool down with 5-10 minutes of light cardio and stretching." ] } },
                passive: { title: "Table 3: Passive Workout (Recovery Days)", description: "Choose any one based on your dosha type or interest.", activities: [ { activity: "Gentle Walking", duration: "20-40 min", thr: "40-50% THR", notes: "Focus on breath and relaxation." }, { activity: "Restorative Yoga / Gentle Hatha", duration: "20-40 min", thr: "-", notes: "Focus on breath and relaxation." }, { activity: "Tai Chi / Qigong", duration: "20-30 min", thr: "-", notes: "Slow, flowing movements." }, { activity: "Light Cycling (flat terrain)", duration: "20-30 min", thr: "40-50% THR" }, { activity: "Swimming (gentle pace)", duration: "20-30 min", thr: "40-50% THR", notes: "Especially good for Pitta, Vata be mindful of water temperature." }, { activity: "Foam Rolling & Deep Stretching", duration: "15-20 min", thr: "-", notes: "Focus on tight areas." } ] }
            },
            doshaSpecifics: {
                vata: { title: "Vata Dosha: Grounding & Stability Focus", yogaRecommendations: { title: "Yoga Recommendations - Vata Dosha", points: ["Slow-paced asanas or poses (postures).", "Gaze down and focussed.", "Avoid power yoga or hot yoga.", "Simple balancing and static postures should practiced."] }, generalGuidelines: { title: "General Exercise Guidelines for Vata Dosha", bestTime: "Early morning or between 2:00 PM and 6:00 PM. Avoid exercising at night as it can be too stimulating.", intensity: "Favor: Slow-paced, gentle, lightweight, consistent routines and low-intensity exercises. Avoid: Fast-paced, high-intensity, extreme weather, and late-night exercises.", goals: "Regularity, low-impact movements, warming, grounding, steady, and strength-building workouts.", recommendedTypes: "Rowing, yoga, cycling, weight training, and walking are ideal." }, workoutFrequency: { title: "Workout Frequency for Vata Dosha", regular: "Table 1: Regular Workout: 2-3 times per week.", intensive: "Table 2: Intensive Workout (Group Classes OR Circuit Training Alternative): Once a week.", passive: "Table 3: Passive Workout (Recovery Days): 2-3 times per week." } },
                pitta: { title: "Pitta Dosha: Cooling & Endurance Focus", yogaRecommendations: { title: "Yoga Recommendations - Pitta Dosha", points: ["Medium-paced asanas or poses (postures).", "Avoid power yoga or hot Yoga.", "Avoid Yoga in the direct sun.", "Avoid headstands and sun salutations.", "Favor twists and forward folds."] }, generalGuidelines: { title: "General Exercise Guidelines for Pitta Dosha", bestTime: "Early morning or between 4:00 PM and 6:00 PM. Avoid intense exercising at night as it can be too stimulating.", intensity: "Favor: Medium-paced, moderate intensity, cool environments, shaded areas. Avoid: Direct sunlight, exercising mid-day (especially in summer), exercising in extreme heat, using rigid regimens, and engaging in competitive exercise.", goals: "Workouts should focus on low- to moderate-intensity cardio, such as a brisk walk, performed at 65-75% of your maximum heart rate to maintain size and shape.", recommendedTypes: "Their favorites include boot camps, boxing, CrossFit, and weight training exercises. Adding occasional sprints or high-intensity interval training (HIIT) is beneficial because you're specifically working on types of activity that don't come naturally." }, workoutFrequency: { title: "Workout Frequency for Pitta Dosha", regular: "Table 1: Regular Workout: 3-4 times per week.", intensive: "Table 2: Intensive Workout (Group Classes OR Circuit Training Alternative): 1-2 times per week.", passive: "Table 3: Passive Workout (Recovery Days): 1-2 times per week." } },
                kapha: { title: "Kapha Dosha: Activation & High-Intensity Focus", yogaRecommendations: { title: "Yoga Recommendations - Kapha Dosha", points: ["Medium to fast-paced asanas or poses (postures).", "Favor classes with more movements.", "Morning classes are beneficial for boosting circulation and shaking off grogginess at the start of the day.", "Favor sun salutations.", "Favor twists, twists, core works, and chest openers."] }, generalGuidelines: { title: "General Exercise Guidelines for Kapha Dosha", bestTime: "Between 6-10 in the morning (best) or 6-9 in the evening. Avoid late-night exercise if it causes sleep issues.", intensity: "Favor: Medium to high-intensity exercise, high reps, fast pace, and a variety of exercises. Avoid: low pace, extended breaks, low intensity, monotonous regimen, and excessive water drinking.", goals: "Use short rest periods, circuits for resistance exercises, and as much time as possible for steady-state cardio.", recommendedTypes: "Kapha types are particularly responsive to isolation exercises (working one muscle at a time), so targeting the quads with squats, lunges, and biceps with biceps curls, for example, will likely be effective." }, workoutFrequency: { title: "Workout Frequency for Kapha Dosha", regular: "Table 1: Regular Workout: 3-4 times per week.", intensive: "Table 2: Intensive Workout (Group Classes OR Circuit Training Alternative): 2-3 times per week.", passive: "Table 3: Passive Workout (Recovery Days): 1-2 times per week." } }
            },
            generalNotes: { title: "General Notes & Important Considerations", notes: [ "Consult a trainer or healthcare professional for underlying health conditions or injuries.", "If you are keen on practicing yoga, beginners are advised to train under the guidance of a yoga instructor. Once you understand the concepts and forms, you can practice independently.", "Rest for 30 seconds to 2 minutes between sets, depending on your Prakriti or Constitution.", "Begin with light dumbbells or weights, comfortably performing 12–15 repetitions...", "The strength exercise recommendations are an essential mix of exercises...", "Stay hydrated with intermittent sips of water...", "Swimming is beneficial for Vata dosha but should be limited...", "Monitor your Target Heart Rate (THR)...", "Breathe normally through your nose while exercising...", "If the seventh day of the week is designated for training...", "Pay close attention to how your body feels...", "Adjust rest days and exercise frequency as needed...", "Programs are provided separately for gym users and those who prefer exercising at home...", "Adjustments can be made as you advance, but honoring your body's natural limits is crucial..." ] },
            exerciseActionsToAvoid: { title: "Exercise Actions to Avoid", actions: [ "Jumping exercises (especially for beginners or individuals over 40).", "Full squats or deep squats with weights that strain the joints.", "Full-body push-ups: beginners should perform knee-supported push-ups instead.", "Swinging weights, such as dumbbells or bars, can cause injury.", "If you are a beginner, start with half crunches or sit-ups.", "Keep your legs bent from the knee to avoid placing direct pressure on your lower back...", "Stretching beyond the point of pain or discomfort.", "Stretching without warming up; ensure light cardio..." ] },
            externalResources: { title: "Additional Resources", links: [ "For free access to customized dashboard displaying all your Ayurvedic and Modern health parameters... Please visit <a href='https://samavitals.com/my-account/' target='_blank'>https://samavitals.com/my-account/</a> to create your free account. The information on the dashboard will help you design your meal and exercise plans according to Ayurvedic principles.", "For videos on performing the prescribed exercises correctly, you can visit my YouTube channel - <a href='https://www.youtube.com/@samavitals' target='_blank'>https://www.youtube.com/@samavitals</a>." ] }
        }, // End exerciseAdvisorData
        stressManagementData: {
            scriptCatalog: [
                { value: "10min_Script1", text: "10 Minutes - Breath of Tranquility", durationMinutes: 10, scriptTitle: "The 10-Minute Breath of Tranquility" },
                { value: "30min_Script11", text: "30 Minutes - Journey to Sanctuary", durationMinutes: 30, scriptTitle: "Journey to Your Extended Sanctuary: Dissolving Anxiety" },
                { value: "40min_Script21", text: "40 Minutes - Mind-Body Rejuvenation", durationMinutes: 40, scriptTitle: "Total Mind-Body Rejuvenation for Chronic Stress Patterns" }
            ],
            scripts: {
                "10min_Script1": `(Induction)\nBegin by finding a comfortable position... (Full script text from previous response) ...wonderfully refreshed.\n`,
                "30min_Script11": `(Induction)\nBegin by settling into a comfortable position... (Full script text from previous response) ...stretch if you wish.\n`,
                "40min_Script21": `(Induction)\nPlease find a position where your body can be... (Full script text from previous response) ...and enjoy this feeling.\n`
            },
            tonalityGuidelines: {
                "Vata": { pace: "Slow, steady, and deliberate. Avoid rushing or speaking too quickly.", volume: "Moderate to soft. A gentle and soothing tone.", pitch: "A slightly lower and more grounded pitch.", emphasis: "Reassuring and empathetic.", elevenLabsVoiceId: SUNNY_SINGH_VOICE_ID },
                "Pitta": { pace: "Moderate, clear, and direct.", volume: "Moderate to slightly assertive. Confident.", pitch: "A clear, resonant pitch.", emphasis: "Focus on facts, logic, precision.", elevenLabsVoiceId: SUNNY_SINGH_VOICE_ID },
                "Kapha": { pace: "Slow, deliberate, and very patient.", volume: "Soft and warm. Comforting and reassuring.", pitch: "A lower, warm, soothing pitch.", emphasis: "Supportive and nurturing.", elevenLabsVoiceId: SUNNY_SINGH_VOICE_ID }
            }
        },

        // ... after stressManagementData } ...
        // End stressManagementData
        // IMPORTANT: Add a comma here

        // =============================================
        // ========= NEW VITALS ADVISOR DATA ===========
        // =============================================
        vitalsAdvisorData: {
            hrv: {
                male: [
                    { age: [20, 25], low: 39, high: 71 }, { age: [26, 35], low: 34, high: 64 },
                    { age: [36, 45], low: 30, high: 55 }, { age: [46, 55], low: 27, high: 50 },
                    { age: [56, 65], low: 25, high: 46 }, { age: [66, 99], low: 24, high: 44 }
                ],
                female: [
                    { age: [20, 25], low: 35, high: 69 }, { age: [26, 35], low: 33, high: 61 },
                    { age: [36, 45], low: 30, high: 56 }, { age: [46, 55], low: 27, high: 51 },
                    { age: [56, 65], low: 25, high: 47 }, { age: [66, 99], low: 24, high: 44 }
                ]
            },
            spo2: {
                normal: { range: [95, 100], feedback: "Your SpO2 level is normal, indicating excellent blood oxygen saturation." },
                borderline: { range: [91, 94], feedback: "Your SpO2 level is borderline. This can be normal, but monitor for any symptoms like shortness of breath. Ensure good ventilation." },
                low: { range: [0, 90], feedback: "Your SpO2 level is low. It is advisable to consult a healthcare professional. This can indicate issues with lung function or circulation." }
            },
            pulse: {
                male: [
                    { age: [18, 25], athlete: 56, good: 65, average: 73, poor: 81 },
                    { age: [26, 35], athlete: 55, good: 65, average: 73, poor: 81 },
                    { age: [36, 45], athlete: 57, good: 66, average: 74, poor: 82 },
                    { age: [46, 55], athlete: 58, good: 67, average: 75, poor: 83 },
                    { age: [56, 65], athlete: 57, good: 67, average: 75, poor: 83 },
                    { age: [66, 99], athlete: 56, good: 65, average: 73, poor: 81 }
                ],
                female: [
                    { age: [18, 25], athlete: 61, good: 70, average: 78, poor: 84 },
                    { age: [26, 35], athlete: 60, good: 68, average: 76, poor: 82 },
                    { age: [36, 45], athlete: 62, good: 69, average: 77, poor: 84 },
                    { age: [46, 55], athlete: 63, good: 70, average: 77, poor: 84 },
                    { age: [56, 65], athlete: 62, good: 70, average: 78, poor: 84 },
                    { age: [66, 99], athlete: 60, good: 68, average: 76, poor: 83 }
                ]
            }
        } // End vitalsAdvisorData

    }; // End HubData
        
    // (The rest of your JavaScript functions: navigateToModule, getExerciseAppAgeGroup, renderGeneralList, renderGeneralTable,
    // Diet Planner functions, Exercise Advisor functions, Stress Management functions, Event Listeners, Initial Setup)
    // ... Ensure all functions are present and correctly reference HubData subsections ...
    // ... (The full script functions from the previous "Okay, this is the perfect next step!" response should follow here)
    // ... (This includes all DOMContentLoaded logic)
    console.log("HubData Initialized with corrected structure.");

    // --- Diet Planner State ---
    let dietSelectedCustomFoods = new Map(); 

    // --- Helper Functions (Shared) ---
    function navigateToModule(moduleId) {
        console.log(`Navigating to module: ${moduleId}`);
        moduleSections.forEach(section => {
            if (section) section.classList.remove('active-module');
        });
        const activeModule = document.getElementById(moduleId);
        if (activeModule) {
            activeModule.classList.add('active-module');
            if (mainNav) {
                mainNav.querySelectorAll('.nav-button').forEach(btn => {
                    btn.classList.toggle('active-nav', btn.dataset.section === moduleId);
                });
            }
            if (moduleId === 'stressManagementModule' && hubStressDoshaRecap && userProfile.dosha) {
                hubStressDoshaRecap.textContent = userProfile.dosha;
            }
        } else { console.error(`Module with ID ${moduleId} not found.`); }
    }

    function getExerciseAppAgeGroup(age) {
        if (age === null || age === undefined) return null;
        if (age >= 10 && age <= 19) return "10-19";
        if (age >= 20 && age <= 30) return "20-30";
        if (age >= 31 && age <= 40) return "31-40";
        if (age >= 41 && age <= 50) return "41-50";
        if (age >= 51 && age <= 55) return "51-55";
        if (age >= 56 && age <= 65) return "56-65";
        if (age >= 66) return "66-75+";
        return null;
    }

    function renderGeneralList(itemsArray) {
        if (!itemsArray || !Array.isArray(itemsArray) || itemsArray.length === 0) return "<p>No information available.</p>";
        return `<ul>${itemsArray.map(item => `<li>${item}</li>`).join('')}</ul>`;
    }

    function renderGeneralTable(headersArray, dataRowsArray) {
        if (!dataRowsArray || !Array.isArray(dataRowsArray) || dataRowsArray.length === 0) return "<p>No data available for this table.</p>";
        let tableHtml = '<table><thead><tr>';
        if (Array.isArray(headersArray)) {
            headersArray.forEach(header => tableHtml += `<th>${header}</th>`);
        }
        tableHtml += '</tr></thead><tbody>';
        dataRowsArray.forEach(row => {
            tableHtml += '<tr>';
            if (Array.isArray(row)) {
                row.forEach(cell => tableHtml += `<td>${cell === undefined || cell === null ? '-' : cell}</td>`);
            } else {
                console.warn("renderGeneralTable expected an array for a row, received:", row);
                Object.values(row).forEach(cell => tableHtml += `<td>${cell === undefined || cell === null ? '-' : cell}</td>`);
            }
            tableHtml += '</tr>';
        });
        tableHtml += '</tbody></table>';
        return tableHtml;
    }

    // --- Diet Planner Functions ---
    function formatDietCategoryName(categoryKey) { 
        if (!categoryKey) return "Unknown Category";
        if (categoryKey === 'eggsMeats') return 'Meat & Eggs';
        if (categoryKey === 'nutsSeeds') return 'Nuts & Seeds';
        return categoryKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }
    function getDietNutritionalInfo(foodItemName) { 
        const nutritionDb = HubData.dietPlannerData.nutritionData;
        if (!nutritionDb) { console.error("Nutrition DB missing!"); return { calories: 0, protein: 0, carbs: 0, fat: 0, unit: "g" }; }
        if (typeof foodItemName !== 'string') { return { ...(nutritionDb["Default"] || { calories: 0, protein: 0, carbs: 0, fat: 0, unit: "g" }) };}
        let foodData = nutritionDb[foodItemName] || nutritionDb[foodItemName.split(' (')[0]] || nutritionDb["Default"];
        return { ...(foodData || { calories: 0, protein: 0, carbs: 0, fat: 0, unit: "g" }) };
    }
    function createDietSelectedFoodTag(foodObject) { 
        const itemTag = document.createElement('span'); itemTag.classList.add('selected-item-tag');
        itemTag.setAttribute('data-food-item', foodObject.foodItem); itemTag.setAttribute('data-category-key', foodObject.categoryKey);itemTag.setAttribute('data-type', foodObject.type);
        const foodNameSpan = document.createElement('span'); foodNameSpan.textContent = foodObject.foodItem; itemTag.appendChild(foodNameSpan);
        const quantityInput = document.createElement('input'); quantityInput.type = 'number'; quantityInput.min = '1'; quantityInput.value = foodObject.quantity || 100; quantityInput.placeholder = 'grams'; quantityInput.title = 'Enter quantity in grams'; quantityInput.classList.add('quantity-input');
        quantityInput.addEventListener('change', (event) => { const nQ = parseInt(event.target.value); if (!isNaN(nQ) && nQ > 0) { foodObject.quantity = nQ; if (customDietPlanOutput && (customDietPlanOutput.style.display === 'block' || (selectedFoodsDietDisplay && selectedFoodsDietDisplay.offsetParent !== null))) renderDietSelectedFoodsDisplay(); } else { event.target.value = foodObject.quantity; }});
        itemTag.appendChild(quantityInput);
        const unitSpan = document.createElement('span'); unitSpan.textContent = 'g'; unitSpan.classList.add('unit-span'); itemTag.appendChild(unitSpan);
        const removeBtn = document.createElement('button'); removeBtn.classList.add('remove-btn'); removeBtn.textContent = '×'; removeBtn.title = `Remove ${foodObject.foodItem}`;
        removeBtn.addEventListener('click', (event) => { event.stopPropagation(); removeDietSelectedFood(foodObject); }); itemTag.appendChild(removeBtn); return itemTag;
    }
    function addDietSelectedFood(foodItemName, categoryKey, type) { 
        const mapKey = `${formatDietCategoryName(categoryKey)}${type === 'pacifying' ? ' (Recommended)' : type === 'aggravating' ? ' (To Avoid)' : ' (Use in Moderation)'}`;
        if (!dietSelectedCustomFoods.has(mapKey)) dietSelectedCustomFoods.set(mapKey, new Set());
        const set = dietSelectedCustomFoods.get(mapKey); for (let item of set) if (item.foodItem === foodItemName) { /* focus existing input */ return; }
        const newObj = { foodItem: foodItemName, quantity: 100, categoryKey, type, categoryMapKey: mapKey }; set.add(newObj);
        const elHost = dietPlannerModule || document; const cont = elHost.querySelector(`.food-category-selector[data-category-key="${categoryKey}"][data-type="${type}"] .selected-items-tags-container`); if (cont) cont.appendChild(createDietSelectedFoodTag(newObj));
    }
    function removeDietSelectedFood(foodObjectToRemove) { 
        if (dietSelectedCustomFoods.has(foodObjectToRemove.categoryMapKey)) { const set = dietSelectedCustomFoods.get(foodObjectToRemove.categoryMapKey); let found = null; for (let item of set) if (item.foodItem === foodObjectToRemove.foodItem && item.categoryKey === foodObjectToRemove.categoryKey && item.type === foodObjectToRemove.type) { found = item; break; } if (found) { set.delete(found); if (set.size === 0) dietSelectedCustomFoods.delete(foodObjectToRemove.categoryMapKey); const elHost = dietPlannerModule || document; const tag = elHost.querySelector(`.food-category-selector[data-category-key="${foodObjectToRemove.categoryKey}"][data-type="${foodObjectToRemove.type}"] .selected-items-tags-container [data-food-item="${CSS.escape(foodObjectToRemove.foodItem)}"]`); if (tag && tag.parentNode) tag.parentNode.removeChild(tag); if (customDietPlanOutput && (customDietPlanOutput.style.display === 'block' || (selectedFoodsDietDisplay && selectedFoodsDietDisplay.offsetParent !== null))) renderDietSelectedFoodsDisplay();}}
    }
    function renderDietFoodSelectionDropdowns(foodCategoriesData, targetDiv, type) { 
        if (!targetDiv) { console.error(`renderDietFoodSelectionDropdowns: targetDiv is null for type: ${type}`); return; }
        if (!foodCategoriesData || typeof foodCategoriesData !== 'object') { targetDiv.innerHTML = `<p class="error-message">Food category data missing for selection.</p>`; return; }
        const order = ['fruits', 'vegetables', 'grains', 'legumes', 'dairy', 'nutsSeeds', 'eggsMeats', 'oils', 'sweeteners', 'spices'];
        const sortedKeys = Object.keys(foodCategoriesData).sort((a,b) => order.indexOf(a) - order.indexOf(b));
        const frag = document.createDocumentFragment();
        sortedKeys.forEach(catKey => {
            const catData = foodCategoriesData[catKey]; if (!catData || typeof catData !== 'object') return;
            let items = [], suffix = '';
            if (type === 'pacifying' && Array.isArray(catData.pacifying)) { items = catData.pacifying; suffix = ' (Recommended)'; }
            else if (type === 'aggravating' && Array.isArray(catData.aggravating)) { items = catData.aggravating; suffix = ' (To Avoid)'; }
            else if (type === 'useInModeration' && Array.isArray(catData.useInModeration)) { items = catData.useInModeration; suffix = ' (Use in Moderation)'; }
            else return;
            if (items.length > 0) {
                const div = document.createElement('div'); div.className = 'food-category-selector'; div.dataset.categoryKey = catKey; div.dataset.type = type;
                const lbl = document.createElement('label'); lbl.textContent = `${formatDietCategoryName(catKey)}${suffix}:`; div.appendChild(lbl);
                const sel = document.createElement('select'); sel.size = Math.min(items.length + 1, 7); sel.title = `Select ${formatDietCategoryName(catKey)}`;
                const defOpt = document.createElement('option'); defOpt.value = ""; defOpt.textContent = "-- Select an item --"; sel.appendChild(defOpt);
                items.sort().forEach(i => { const opt = document.createElement('option'); opt.value = i; opt.textContent = i; sel.appendChild(opt);});
                sel.addEventListener('change', e => { if(e.target.value) { addDietSelectedFood(e.target.value, catKey, type); e.target.value = ""; }});
                div.appendChild(sel); const tagsDiv = document.createElement('div'); tagsDiv.className = 'selected-items-tags-container'; div.appendChild(tagsDiv); frag.appendChild(div);
            }
        });
        targetDiv.appendChild(frag);
        dietSelectedCustomFoods.forEach((foodSet, mapKeyVal) => foodSet.forEach(fObj => { if (fObj.type === type) { const elHost = dietPlannerModule || document; const tc = elHost.querySelector(`.food-category-selector[data-category-key="${fObj.categoryKey}"][data-type="${fObj.type}"] .selected-items-tags-container`); if (tc && !tc.querySelector(`span.selected-item-tag[data-food-item="${CSS.escape(fObj.foodItem)}"]`)) tc.appendChild(createDietSelectedFoodTag(fObj));}}));
    }
    function renderDietSelectedFoodsDisplay() { 
        if (!selectedFoodsDietDisplay) return; selectedFoodsDietDisplay.innerHTML = '';
        let allFoods = []; dietSelectedCustomFoods.forEach(set => set.forEach(obj => allFoods.push(obj)));
        if (allFoods.length === 0) { selectedFoodsDietDisplay.innerHTML = '<p class="empty-plan-message">No foods selected yet.</p>'; return; }
        const categorized = new Map(); allFoods.forEach(obj => { if(!categorized.has(obj.categoryMapKey)) categorized.set(obj.categoryMapKey, []); categorized.get(obj.categoryMapKey).push(obj);});
        const sortedCatKeys = Array.from(categorized.keys()).sort(); let totals = { cal:0, pro:0, carb:0, fat:0 };
        sortedCatKeys.forEach(mapKeyVal => {
            const items = categorized.get(mapKeyVal).sort((a,b) => a.foodItem.localeCompare(b.foodItem));
            if (items.length > 0) {
                const catDiv = document.createElement('div'); catDiv.className = 'selected-food-category'; const title = document.createElement('h4'); title.textContent = mapKeyVal; catDiv.appendChild(title);
                const table = document.createElement('table'); table.className = 'nutrition-table'; const thd = table.createTHead(); const hr = thd.insertRow();
                ["Food Item", "Qty (g)", "Calories (kcal)", "Protein (g)", "Carbs (g)", "Fat (g)"].forEach(txt => { const th = document.createElement('th'); th.textContent = txt; hr.appendChild(th); });
                const tb = table.createTBody(); let catTotals = { cal:0, pro:0, carb:0, fat:0 };
                items.forEach(fObj => {
                    const row = tb.insertRow(); const nutr = getDietNutritionalInfo(fObj.foodItem); const fact = fObj.quantity/100;
                    const c={cal:(nutr.calories||0)*fact, pro:(nutr.protein||0)*fact, carb:(nutr.carbs||0)*fact, fat:(nutr.fat||0)*fact};
                    Object.keys(catTotals).forEach(k => catTotals[k]+=c[k]);
                    row.insertCell().textContent=fObj.foodItem; row.insertCell().textContent=fObj.quantity; row.insertCell().textContent=c.cal.toFixed(1); row.insertCell().textContent=c.pro.toFixed(1); row.insertCell().textContent=c.carb.toFixed(1); row.insertCell().textContent=c.fat.toFixed(1);
                });
                table.appendChild(tb); const tf = table.createTFoot(); const fr = tf.insertRow(); fr.className = 'category-totals-row';
                fr.insertCell().textContent="Category Totals:"; fr.insertCell(); Object.values(catTotals).forEach(v => fr.insertCell().textContent = v.toFixed(1));
                catDiv.appendChild(table); selectedFoodsDietDisplay.appendChild(catDiv);
                Object.keys(totals).forEach(k => totals[k]+=catTotals[k]);
            }
        });
        const sumDiv = document.createElement('div'); sumDiv.className = 'grand-totals-summary';
        sumDiv.innerHTML = `<h3>Overall Nutrition Summary</h3><p><strong>Total Calories: ${totals.cal.toFixed(1)} kcal</strong></p><p>Total Protein: ${totals.pro.toFixed(1)} g</p><p>Total Carbs: ${totals.carb.toFixed(1)} g</p><p>Total Fat: ${totals.fat.toFixed(1)} g</p><p class="nutrition-disclaimer"><em>Nutritional information is estimated...</em></p>`;
        selectedFoodsDietDisplay.appendChild(sumDiv);
    }

    // --- Exercise Advisor Functions ---
    function renderExerciseHowToUseGuide() { 
         if (!exerciseHowToUseGuideDiv || !HubData.exerciseAdvisorData || !HubData.exerciseAdvisorData.howToUseGuide || !HubData.exerciseAdvisorData.howToUseGuide.notes) { if(exerciseHowToUseGuideDiv) exerciseHowToUseGuideDiv.innerHTML = "<p>How to use guide not available.</p>"; return; }
        exerciseHowToUseGuideDiv.innerHTML = `<h3>${HubData.exerciseAdvisorData.howToUseGuide.title}</h3>${renderGeneralList(HubData.exerciseAdvisorData.howToUseGuide.notes)}`;
    }
    function renderExerciseTHR(age) { 
        if (!exerciseThrDiv || !HubData.exerciseAdvisorData.thrInfo || !age) { if(exerciseThrDiv) exerciseThrDiv.innerHTML = "<p>THR info not available.</p>"; return;}
        const d = HubData.exerciseAdvisorData.thrInfo; let h = `<h3>${d.title}</h3>`; if(d.exampleFormula) h += `<p>Formula: ${d.exampleFormula.replace('Age', `<strong>${age}</strong>`)}</p>`;
        h += `<p><strong>Your Approx. THR Zones:</strong></p><ul>`; const mhr = 220-age;
        h += `<li>Light (50-60%): ~${Math.round(mhr*0.50)}-${Math.round(mhr*0.60)} BPM</li>`; h += `<li>Moderate (60-75%): ~${Math.round(mhr*0.60)}-${Math.round(mhr*0.75)} BPM</li>`; h += `<li>Intensive (75-85%): ~${Math.round(mhr*0.75)}-${Math.round(mhr*0.85)} BPM</li></ul>`;
        if(d.whyItMatters) h += `<p>${d.whyItMatters}</p>`; const ag = getExerciseAppAgeGroup(age); const cd = d.chart && Array.isArray(d.chart) ? d.chart.find(r=>r.ageGroup===ag) : null;
        if(cd) h += `<h4>${d.chartTitle} (${cd.ageGroup})</h4><p>Light: ${cd.light}</p><p>Moderate: ${cd.moderate}</p><p>Intensive: ${cd.intensive}</p>`;
        exerciseThrDiv.innerHTML = h;
    }
    function renderExerciseWeeklyFrequencyByAge(age) { 
        if (!exerciseWeeklyFrequencyByAgeDiv || !HubData.exerciseAdvisorData.weeklyFrequencyByAge || !age) { if(exerciseWeeklyFrequencyByAgeDiv) exerciseWeeklyFrequencyByAgeDiv.innerHTML = "<p>Weekly frequency info not available.</p>"; return; }
        const d = HubData.exerciseAdvisorData.weeklyFrequencyByAge; let h = `<h3>${d.title}</h3>`; const ag = getExerciseAppAgeGroup(age); const fd = d.data && Array.isArray(d.data) ? d.data.find(x=>x.ageGroup===ag) : null;
        if(fd) h += `<p><strong>For age group (${ag}):</strong></p><ul><li>Regular: ${fd.regular}</li><li>Passive: ${fd.passive}</li><li>Intensive: ${fd.intensive}</li><li>Rest: ${fd.rest}</li></ul>`; else h += "<p>Specific weekly frequency not found.</p>";
        exerciseWeeklyFrequencyByAgeDiv.innerHTML = h;
    }
    function renderExerciseWorkoutCategoryPlans() { 
        if (!HubData.exerciseAdvisorData.workoutPlans) { if(exerciseRegularWorkoutDiv) exerciseRegularWorkoutDiv.innerHTML = "<p>Workout plans not available.</p>"; return; }
        const p = HubData.exerciseAdvisorData.workoutPlans; const exists = e => e !== null && e !== undefined;
        if(exists(exerciseRegularWorkoutDiv) && p.regular && p.regular.exercises) { let h=`<h4>${p.regular.title}</h4>`; h+=renderGeneralTable(["Ex","Gym","Home","Sets","Reps","THR"],p.regular.exercises.map(x=>[x.exercise,x.gym,x.home,x.sets,x.reps,x.thr])); exerciseRegularWorkoutDiv.innerHTML=h;}
        if(exists(exerciseIntensiveWorkoutDiv) && p.intensive) { let h=`<h4>${p.intensive.title}</h4>`; if(p.intensive.description)h+=`<p>${p.intensive.description}</p>`; if(p.intensive.groupClassesInfo)h+=`<p><strong>Group Classes:</strong> ${p.intensive.groupClassesInfo}</p>`; if(p.intensive.circuitAlternative && p.intensive.circuitAlternative.exercises && Array.isArray(p.intensive.circuitAlternative.exercises)){h+=`<p><strong>Circuit Training Alt:</strong></p>`; h+=renderGeneralTable(["Ex","Gym","Home","Sets","Reps","THR"],p.intensive.circuitAlternative.exercises.map(x=>[x.exercise,x.gym,x.home,x.sets,x.reps,x.thr])); if(p.intensive.circuitAlternative.circuitInstructions && Array.isArray(p.intensive.circuitAlternative.circuitInstructions))h+=`<h5>Circuit Instructions:</h5>${renderGeneralList(p.intensive.circuitAlternative.circuitInstructions)}`;} exerciseIntensiveWorkoutDiv.innerHTML=h;}
        if(exists(exercisePassiveWorkoutDiv) && p.passive && p.passive.activities && Array.isArray(p.passive.activities)) { let h=`<h4>${p.passive.title}</h4>`; if(p.passive.description)h+=`<p>${p.passive.description}</p>`; h+=renderGeneralTable(["Activity","Duration","THR","Notes"],p.passive.activities.map(x=>[x.activity,x.duration,x.thr,x.notes||'-'])); exercisePassiveWorkoutDiv.innerHTML=h;}
    }
    function renderExerciseDoshaSpecificRecommendations(doshaKey) { 
        if (!exerciseDoshaSpecificRecommendationsDiv || !HubData.exerciseAdvisorData.doshaSpecifics || !doshaKey) { if(exerciseDoshaSpecificRecommendationsDiv) exerciseDoshaSpecificRecommendationsDiv.innerHTML = "<p>Dosha specific exercise info not available.</p>"; return; }
        const ldk = doshaKey.toLowerCase(); const dd = HubData.exerciseAdvisorData.doshaSpecifics[ldk];
        if(!dd) { exerciseDoshaSpecificRecommendationsDiv.innerHTML = `<p>Exercise recommendations for ${doshaKey} unavailable.</p>`; return; }
        let h=`<h3>${dd.title}</h3>`; if(dd.yogaRecommendations && dd.yogaRecommendations.points)h+=`<h4>${dd.yogaRecommendations.title}</h4>${renderGeneralList(dd.yogaRecommendations.points)}`; if(dd.generalGuidelines){h+=`<h4>${dd.generalGuidelines.title}</h4><p><strong>Best Time:</strong> ${dd.generalGuidelines.bestTime}</p><p><strong>Intensity:</strong> ${dd.generalGuidelines.intensity}</p><p><strong>Goals:</strong> ${dd.generalGuidelines.goals}</p><p><strong>Types:</strong> ${dd.generalGuidelines.recommendedTypes}</p>`;} if(dd.workoutFrequency){h+=`<h4>${dd.workoutFrequency.title}</h4><ul><li>${dd.workoutFrequency.regular}</li><li>${dd.workoutFrequency.intensive}</li><li>${dd.workoutFrequency.passive}</li></ul>`;}
        exerciseDoshaSpecificRecommendationsDiv.innerHTML = h;
    }
    function renderExerciseGeneralNotes() { 
        if(!exerciseGeneralNotesDiv || !HubData.exerciseAdvisorData.generalNotes || !HubData.exerciseAdvisorData.generalNotes.notes) {if(exerciseGeneralNotesDiv) exerciseGeneralNotesDiv.innerHTML = "<p>General notes not available.</p>"; return;}
        exerciseGeneralNotesDiv.innerHTML = `<h3>${HubData.exerciseAdvisorData.generalNotes.title}</h3>${renderGeneralList(HubData.exerciseAdvisorData.generalNotes.notes)}`;
    }
    function renderExerciseActionsToAvoid() { 
        if(!exerciseExerciseActionsToAvoidDiv || !HubData.exerciseAdvisorData.exerciseActionsToAvoid || !HubData.exerciseAdvisorData.exerciseActionsToAvoid.actions) {if(exerciseExerciseActionsToAvoidDiv) exerciseExerciseActionsToAvoidDiv.innerHTML = "<p>Actions to avoid not available.</p>"; return;}
        exerciseExerciseActionsToAvoidDiv.innerHTML = `<h3>${HubData.exerciseAdvisorData.exerciseActionsToAvoid.title}</h3>${renderGeneralList(HubData.exerciseAdvisorData.exerciseActionsToAvoid.actions)}`;
    }
    function renderExerciseExternalResources() { 
        if(!exerciseExternalResourcesDiv || !HubData.exerciseAdvisorData.externalResources || !HubData.exerciseAdvisorData.externalResources.links) {if(exerciseExternalResourcesDiv) exerciseExternalResourcesDiv.innerHTML = "<p>External resources not available.</p>"; return;}
        exerciseExternalResourcesDiv.innerHTML = `<h3>${HubData.exerciseAdvisorData.externalResources.title}</h3>${renderGeneralList(HubData.exerciseAdvisorData.externalResources.links)}`;
    }

    // --- Stress Management Functions ---
    function populateStressSessionDurationDropdown() {
        if (!hubSessionDurationSelect || !HubData.stressManagementData || !HubData.stressManagementData.scriptCatalog || !Array.isArray(HubData.stressManagementData.scriptCatalog)) {
            console.error("Cannot populate session duration dropdown (Hub). Element or scriptCatalog data not found or invalid.");
            return;
        }
        while (hubSessionDurationSelect.options.length > 1) {
            hubSessionDurationSelect.remove(1);
        }
        HubData.stressManagementData.scriptCatalog.forEach(item => {
            const option = document.createElement('option');
            option.value = item.value;
            option.textContent = item.text;
            hubSessionDurationSelect.appendChild(option);
        });
    }

    async function startHubStressManagementSession() {
        console.log("Start Hub Stress Management Session clicked.");
        if (!hubStressSessionOutput || !hubSessionDurationSelect || !HubData.stressManagementData || !HubData.stressManagementData.scripts || !HubData.stressManagementData.tonalityGuidelines || !HubData.stressManagementData.scriptCatalog) {
            console.error("Stress management (Hub) DOM elements or data missing.");
            if (hubStressSessionOutput) {
                hubStressSessionOutput.innerHTML = `<p class="error-message">App Error: Required components missing for stress session. Please refresh.</p>`;
                hubStressSessionOutput.style.display = 'block';
            }
            return;
        }
        if (!userProfile.dosha) {
            hubStressSessionOutput.innerHTML = `<p class="error-message">Please save your profile (including Dosha) first before starting a session.</p>`;
            hubStressSessionOutput.style.display = 'block';
            return;
        }

        const selectedScriptKey = hubSessionDurationSelect.value;
        let errorMessage = "";

        if (!selectedScriptKey) { errorMessage = "Please select a session duration."; }

        if (errorMessage) {
            hubStressSessionOutput.innerHTML = `<p class="error-message">${errorMessage}</p>`;
            hubStressSessionOutput.style.display = 'block';
            return;
        }

        const scriptDetails = HubData.stressManagementData.scriptCatalog.find(s => s.value === selectedScriptKey);
        const tonalityInfo = HubData.stressManagementData.tonalityGuidelines[userProfile.dosha];
        const fullScriptText = HubData.stressManagementData.scripts[selectedScriptKey];

        if (!scriptDetails || !tonalityInfo || !fullScriptText || !tonalityInfo.elevenLabsVoiceId) {
            hubStressSessionOutput.innerHTML = `<p class="error-message">Selected session details, script content, tonality guidelines, or ElevenLabs Voice ID configuration not found.</p>`;
            hubStressSessionOutput.style.display = 'block';
            console.error("Missing data for stress session. ScriptDetails:", scriptDetails, "TonalityInfo:", tonalityInfo, "FullScriptText exists:", !!fullScriptText, "VoiceID in TonalityInfo:", !!(tonalityInfo && tonalityInfo.elevenLabsVoiceId));
            return;
        }
        
        const CHARACTER_LIMIT = 10000; 
        if (fullScriptText.length > CHARACTER_LIMIT) {
            hubStressSessionOutput.innerHTML = `<p class="error-message">The selected hypnosis script (${fullScriptText.length} chars) exceeds the character limit (${CHARACTER_LIMIT} chars) for the current voice model. Please choose a shorter script or session.</p>`;
            hubStressSessionOutput.style.display = 'block';
            return;
        }

        let outputHTML = `
            <h4>Now starting: '${scriptDetails.scriptTitle}' (${scriptDetails.durationMinutes} minutes)</h4>
            <div class="tonality-details">
                <p>The guiding voice for your session will aim for the following characteristics, ideal for your <strong>${userProfile.dosha}</strong> Prakriti:</p>
                <ul>
                    <li><strong>Pace:</strong> ${tonalityInfo.pace}</li>
                    <li><strong>Volume:</strong> ${tonalityInfo.volume}</li>
                    <li><strong>Pitch:</strong> ${tonalityInfo.pitch}</li>
                    <li><strong>Emphasis:</strong> ${tonalityInfo.emphasis}</li>
                </ul>
                <p><em>(Voice simulated using ElevenLabs Voice ID: ${tonalityInfo.elevenLabsVoiceId})</em></p>
            </div>
            <p class="session-status" id="hubSessionStatusMessage">Fetching audio and preparing session... Please wait.</p>
            <audio id="hubHypnosisAudioPlayer" controls style="display:none; width:100%; margin-top:15px;"></audio>
            <button id="hubEndSessionBtnSimulated" style="margin:15px auto; display:none; background-color: #d9534f;">End Session</button>
        `;
        hubStressSessionOutput.innerHTML = outputHTML;
        hubStressSessionOutput.style.display = 'block';
        
        const audioElement = document.getElementById('hubHypnosisAudioPlayer');
        const endSessionBtn = document.getElementById('hubEndSessionBtnSimulated');
        const sessionStatusMessage = document.getElementById('hubSessionStatusMessage');

        if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY === "YOUR_ELEVENLABS_API_KEY_HERE" || ELEVENLABS_API_KEY.length < 10) { 
            console.error("ElevenLabs API Key is not set or invalid.");
            if(sessionStatusMessage) sessionStatusMessage.textContent = "Error: API Key for audio generation is not configured or invalid.";
            if(sessionStatusMessage) sessionStatusMessage.style.color = "red";
            return;
        }

        try {
            if(sessionStatusMessage) sessionStatusMessage.textContent = "Generating audio with ElevenLabs... This may take a moment.";
            
            const voiceIdToUse = tonalityInfo.elevenLabsVoiceId;
            const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceIdToUse}`, {
                method: 'POST', headers: { 'Accept': 'audio/mpeg', 'Content-Type': 'application/json', 'xi-api-key': ELEVENLABS_API_KEY },
                body: JSON.stringify({ text: fullScriptText, model_id: "eleven_multilingual_v2", voice_settings: { stability: 0.50, similarity_boost: 0.75 } })
            });

            if (!response.ok) {
                let errorDataText = await response.text(); let errorDataJson = null;
                try { errorDataJson = JSON.parse(errorDataText); } catch (e) { /* ignore */ }
                console.error("ElevenLabs API Error:", response.status, errorDataJson || errorDataText);
                const messageDetail = errorDataJson && errorDataJson.detail && errorDataJson.detail.message ? errorDataJson.detail.message : (errorDataJson && errorDataJson.detail ? JSON.stringify(errorDataJson.detail) : errorDataText || response.statusText);
                if(sessionStatusMessage) sessionStatusMessage.textContent = `Error fetching audio: ${response.status} - ${messageDetail}`;
                if(sessionStatusMessage) sessionStatusMessage.style.color = "red";
                return;
            }

            const audioBlob = await response.blob(); const audioUrl = URL.createObjectURL(audioBlob);
            if (audioElement) {
                audioElement.src = audioUrl; audioElement.style.display = 'block';
                audioElement.play()
                    .then(() => {
                        if(sessionStatusMessage) sessionStatusMessage.textContent = `Session in progress... Playing '${scriptDetails.scriptTitle}'.`;
                        if(sessionStatusMessage) sessionStatusMessage.style.color = "#1565c0";
                        if(endSessionBtn) endSessionBtn.style.display = 'block';
                    })
                    .catch(playError => {
                        console.error("Error playing audio:", playError);
                        if(sessionStatusMessage) sessionStatusMessage.textContent = "Error playing audio. Check browser permissions.";
                        if(sessionStatusMessage) sessionStatusMessage.style.color = "red";
                    });
            }
            if (endSessionBtn && audioElement) {
                endSessionBtn.onclick = () => { 
                    audioElement.pause(); audioElement.currentTime = 0; 
                    if (audioElement.src && audioElement.src.startsWith('blob:')) URL.revokeObjectURL(audioElement.src); 
                    audioElement.src = ""; 
                    const statusP = document.getElementById('hubSessionStatusMessage');
                    if (statusP) { statusP.textContent = `Your ${scriptDetails.durationMinutes}-minute session is complete. Noted (conceptual).`; statusP.className = 'session-complete'; statusP.style.color = ""; }
                    else { const msg = document.createElement('p'); msg.className = 'session-complete'; msg.innerHTML = `Your ${scriptDetails.durationMinutes}-minute session is complete. Noted (conceptual).`; if (hubStressSessionOutput) hubStressSessionOutput.appendChild(msg); }
                    endSessionBtn.style.display = 'none';
                    console.log(`Stress session ${scriptDetails.scriptTitle} for ${userProfile.dosha} ended.`);
                };
            }
        } catch (error) {
            console.error("Error in Stress Session API call/playback:", error);
            if(sessionStatusMessage) sessionStatusMessage.textContent = "An error occurred: " + error.message;
            if(sessionStatusMessage) sessionStatusMessage.style.color = "red";
        }
    } // End startHubStressManagementSession

    // ... before --- EVENT LISTENERS ---

// --- Vitals Advisor Functions ---

function getVitalsFeedback() {
    // 1. Get and Validate Inputs
    const age = parseInt(vitalsAgeInput.value);
    const gender = vitalsGenderSelect.value;
    const hrv = parseInt(vitalsHrvInput.value);
    const spo2 = parseInt(vitalsSpo2Input.value);
    const pulse = parseInt(vitalsPulseInput.value);

    vitalsFeedbackOutput.innerHTML = ''; // Clear previous output
    vitalsFeedbackOutput.style.display = 'block';

    if (!age || !gender || !hrv || !spo2 || !pulse) {
        vitalsFeedbackOutput.innerHTML = `<p class="error-message">Please fill in all fields.</p>`;
        return;
    }
    if (age < 18) {
        vitalsFeedbackOutput.innerHTML = `<p class="error-message">This analysis is for ages 18 and above.</p>`;
        return;
    }

    // 2. Analyze each vital
    const hrvResult = analyzeHrv(hrv, age, gender);
    const spo2Result = analyzeSpo2(spo2);
    const pulseResult = analyzePulse(pulse, age, gender);

    // 3. Build and display HTML output
    vitalsFeedbackOutput.innerHTML = `
        <h3>Your Vitals Analysis</h3>
        ${createFeedbackPanel(hrvResult)}
        ${createFeedbackPanel(spo2Result)}
        ${createFeedbackPanel(pulseResult)}
        <p style="text-align:center; font-style:italic; margin-top:20px;">Disclaimer: This feedback is based on general population data and is for informational purposes only. It is not a substitute for professional medical advice. Consult a healthcare professional for any health concerns.</p>
    `;
}

function analyzeHrv(hrv, age, gender) {
    const data = HubData.vitalsAdvisorData.hrv[gender];
    const rangeData = data.find(d => age >= d.age[0] && age <= d.age[1]);
    let result = { title: "Heart Rate Variability (HRV)", level: "borderline", message: "Could not determine HRV status for the given age." };

    if (rangeData) {
        const { low, high } = rangeData;
        if (hrv < low) {
            result.level = "low"; // This will be Red
            result.message = `Your HRV of ${hrv}ms is below the typical range (${low}ms - ${high}ms) for your age and gender. A lower HRV can be a sign of physical or mental stress, overtraining, or poor sleep. Focusing on recovery and stress management may help.`;
        } else if (hrv > high) {
            result.level = "good"; // CORRECTED: This will now be Green
            result.message = `Your HRV of ${hrv}ms is excellent, falling above the typical range (${low}ms - ${high}ms). This is generally associated with good recovery, stress resilience, and strong cardiovascular fitness.`;
        } else {
            result.level = "good"; // This is already correctly Green
            result.message = `Your HRV of ${hrv}ms is within the normal range (${low}ms - ${high}ms) for your age and gender. This indicates a healthy balance in your autonomic nervous system.`;
        }
    }
    return result;
}

function analyzeSpo2(spo2) {
    const data = HubData.vitalsAdvisorData.spo2;
    let result = { title: "Blood Oxygen (SpO2)", level: "borderline", message: "Invalid SpO2 value." };

    if (spo2 >= data.normal.range[0]) {
        result.level = "good";
        result.message = `Your SpO2 of ${spo2}% is normal. ${data.normal.feedback}`;
    } else if (spo2 >= data.borderline.range[0]) {
        result.level = "borderline";
        result.message = `Your SpO2 of ${spo2}% is borderline. ${data.borderline.feedback}`;
    } else {
        result.level = "low";
        result.message = `Your SpO2 of ${spo2}% is low. ${data.low.feedback}`;
    }
    return result;
}

function analyzePulse(pulse, age, gender) {
    const data = HubData.vitalsAdvisorData.pulse[gender];
    const rangeData = data.find(d => age >= d.age[0] && age <= d.age[1]);
    let result = { title: "Resting Pulse", level: "borderline", message: "Could not determine pulse status for the given age." };

    if (rangeData) {
        if (pulse <= rangeData.athlete) {
            result.level = "good";
            result.message = `Your resting pulse of ${pulse} bpm is excellent, similar to a well-conditioned athlete.`;
        } else if (pulse <= rangeData.good) {
            result.level = "good";
            result.message = `Your resting pulse of ${pulse} bpm is in a good, healthy range for your age and gender.`;
        } else if (pulse <= rangeData.average) {
            result.level = "borderline";
            result.message = `Your resting pulse of ${pulse} bpm is average to above-average. While generally acceptable, improvements in cardiovascular fitness could lower it.`;
        } else if (pulse <= rangeData.poor) {
            result.level = "borderline";
            result.message = `Your resting pulse of ${pulse} bpm is below average. Consider incorporating more regular cardiovascular exercise.`;
        } else {
            result.level = "high";
            result.message = `Your resting pulse of ${pulse} bpm is high. A consistently high resting heart rate may warrant a discussion with a healthcare professional.`;
        }
    }
    return result;
}

function createFeedbackPanel(result) {
    // result object expects { title, level, message }
    return `
        <div class="feedback-panel level-${result.level}">
            <h4>${result.title}: <span style="text-transform: capitalize;">${result.level}</span></h4>
            <p>${result.message}</p>
        </div>
    `;
}

// --- EVENT LISTENERS ---
    // --- EVENT LISTENERS ---
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', () => {
            console.log("Save Profile button clicked.");
            if (profileErrorMessagesDiv) profileErrorMessagesDiv.textContent = '';
            const selectedDoshaValue = profileDoshaSelect ? profileDoshaSelect.value : "";
            const inputAgeText = profileAgeInput ? profileAgeInput.value : "";
            const inputAge = inputAgeText ? parseInt(inputAgeText) : NaN;

            if (!selectedDoshaValue) { if (profileErrorMessagesDiv) profileErrorMessagesDiv.textContent = "Please select your Dosha."; return; }
            if (isNaN(inputAge) || inputAge < 10 || inputAge > 100) { if (profileErrorMessagesDiv) profileErrorMessagesDiv.textContent = "Please enter a valid age (10-100)."; return; }
            
            userProfile.dosha = selectedDoshaValue; 
            userProfile.age = inputAge;
            userProfile.name = document.getElementById('profileNameInput').value || "Guest"; // <-- ADD THIS LINE
            console.log("Profile Saved:", userProfile);

            if (userProfileSection) userProfileSection.style.display = 'none';
            if (mainNav) mainNav.style.display = 'flex';
            if (appMainContent) appMainContent.style.display = 'block';

            if (dietDoshaRecap) dietDoshaRecap.textContent = userProfile.dosha;
            if (dietAgeRecap) dietAgeRecap.textContent = userProfile.age;
            if (exerciseDoshaRecap) exerciseDoshaRecap.textContent = userProfile.dosha;
            if (exerciseAgeRecap) exerciseAgeRecap.textContent = userProfile.age;
            if (hubStressDoshaRecap) hubStressDoshaRecap.textContent = userProfile.dosha;
            
            if (hubSessionDurationSelect) populateStressSessionDurationDropdown();
            navigateToModule('dashboardSection');
            if (dashboardWelcomeMessage) dashboardWelcomeMessage.textContent = `Welcome, ${userProfile.name} (Dosha: ${userProfile.dosha}, Age: ${userProfile.age})! Select a module.`;
        });
    } else { console.error("saveProfileBtn not found."); }

    if (mainNav) {
        mainNav.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-button') && e.target.dataset.section) {
                navigateToModule(e.target.dataset.section);
            }
        });
    }  else { console.error("mainNav not found."); }

    if (getDietRecommendationsBtn) {
        getDietRecommendationsBtn.addEventListener('click', () => { 
            console.log("Get Diet Recommendations clicked.");
            const errorDisplayHost = dietDoshaCharacteristicsDiv || dietRecommendationsOutput;

            if (!userProfile.dosha) {
                const msgTarget = errorDisplayHost && errorDisplayHost.firstChild && errorDisplayHost.firstChild.tagName !== 'H4' ? errorDisplayHost.firstChild : errorDisplayHost;
                if(msgTarget) msgTarget.innerHTML = '<p class="error-message">Please save your profile first (Dosha and Age).</p>';
                if (dietRecommendationsOutput) dietRecommendationsOutput.style.display = 'block';
                return;
            }
            const selectedUserDosha = userProfile.dosha;
            const selectedFoodPref = foodTypeSelect ? foodTypeSelect.value : "All";
            
            if (!HubData.dietPlannerData || !HubData.dietPlannerData[selectedUserDosha] || !HubData.dietPlannerData[selectedUserDosha].foodCategories) {
                console.error(`Diet data for ${selectedUserDosha} or its foodCategories not found.`);
                const errDiv = dietDoshaCharacteristicsDiv || dietRecommendationsOutput; 
                const msgTarget = errDiv && errDiv.firstChild && errDiv.firstChild.tagName !== 'H4' ? errDiv.firstChild : errDiv;
                if(msgTarget) msgTarget.innerHTML = `<p class="error-message">Diet data for ${selectedUserDosha} is incomplete or missing.</p>`;
                if (dietRecommendationsOutput) dietRecommendationsOutput.style.display = 'block';
                return;
            }
            const doshaDietData = HubData.dietPlannerData[selectedUserDosha];

            if (dietRecommendationsOutput) dietRecommendationsOutput.style.display = 'block';
            if (customDietPlanOutput) customDietPlanOutput.style.display = 'none';
            
            let filteredFoodCategories = JSON.parse(JSON.stringify(doshaDietData.foodCategories));
            if (selectedFoodPref === "Vegetarian" && filteredFoodCategories.eggsMeats) {
                filteredFoodCategories.eggsMeats.pacifying = []; filteredFoodCategories.eggsMeats.aggravating = [];
                if(filteredFoodCategories.eggsMeats.useInModeration) filteredFoodCategories.eggsMeats.useInModeration = [];
            }

            if (dietDoshaCharacteristicsDiv) {
                dietDoshaCharacteristicsDiv.innerHTML = `<h4>${selectedUserDosha} Dosha Diet Overview</h4>
                    <p><strong>Characteristics:</strong> ${doshaDietData.characteristics || 'N/A'}</p>
                    <p><strong>Needs:</strong> ${doshaDietData.dietaryNeeds || 'N/A'}</p>
                    <p><strong>Avoid:</strong> ${doshaDietData.avoid || 'N/A'}</p>
                    <p><strong>Ideal:</strong> ${doshaDietData.idealFoods || 'N/A'}</p>
                    <p><strong>Balancing Tastes:</strong> ${doshaDietData.tastesBalancedBy || 'N/A'}</p>
                    <p><strong>Balancing Qualities:</strong> ${doshaDietData.qualitiesBalancedBy || 'N/A'}</p>`;
            }
            dietSelectedCustomFoods.clear();
            if (dietFoodCategoriesPacifyingDiv) dietFoodCategoriesPacifyingDiv.innerHTML = '';
            if (dietFoodCategoriesAggravatingDiv) dietFoodCategoriesAggravatingDiv.innerHTML = '';
            if (selectedFoodsDietDisplay) selectedFoodsDietDisplay.innerHTML = '<p class="empty-plan-message">No foods selected yet.</p>';

            if (dietFoodCategoriesPacifyingDiv && filteredFoodCategories) {
                const h = document.createElement('h5'); h.textContent = 'Customize: Recommended Foods'; dietFoodCategoriesPacifyingDiv.appendChild(h);
                renderDietFoodSelectionDropdowns(filteredFoodCategories, dietFoodCategoriesPacifyingDiv, 'pacifying');
            }
            if (dietFoodCategoriesAggravatingDiv && filteredFoodCategories) {
                const h = document.createElement('h5'); h.textContent = 'Customize: Foods to Avoid/Limit'; dietFoodCategoriesAggravatingDiv.appendChild(h);
                renderDietFoodSelectionDropdowns(filteredFoodCategories, dietFoodCategoriesAggravatingDiv, 'aggravating');
                if (filteredFoodCategories.spices && filteredFoodCategories.spices.useInModeration && filteredFoodCategories.spices.useInModeration.length > 0) {
                    const mh = document.createElement('h5'); mh.textContent = 'Spices to Use in Moderation:'; dietFoodCategoriesAggravatingDiv.appendChild(mh);
                    renderDietFoodSelectionDropdowns({ spices: filteredFoodCategories.spices }, dietFoodCategoriesAggravatingDiv, 'useInModeration');
                }
            }
        });
    } else { console.error("getDietRecommendationsBtn not found."); }

    if (showCustomDietPlanBtn) {
        showCustomDietPlanBtn.addEventListener('click', () => { 
             if (customDietPlanOutput) {
                customDietPlanOutput.style.display = 'block';
                renderDietSelectedFoodsDisplay();
                customDietPlanOutput.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    } else { console.error("showCustomDietPlanBtn not found."); }

    if (getExerciseRecommendationsBtn) {
        getExerciseRecommendationsBtn.addEventListener('click', () => { 
            console.log("Get Exercise Recommendations clicked.");
            const errorDiv = exerciseErrorMessagesDiv || profileErrorMessagesDiv;
            
            if (!userProfile.dosha || userProfile.age === null) {
                if (errorDiv) errorDiv.textContent = "Please save your profile first.";
                if (exerciseRecommendationsArea) exerciseRecommendationsArea.style.display = 'block';
                return;
            }
            if (errorDiv) errorDiv.textContent = '';
            const outputDivs = [exerciseHowToUseGuideDiv, exerciseThrDiv, exerciseWeeklyFrequencyByAgeDiv, exerciseRegularWorkoutDiv, exerciseIntensiveWorkoutDiv, exercisePassiveWorkoutDiv, exerciseDoshaSpecificRecommendationsDiv, exerciseGeneralNotesDiv, exerciseExerciseActionsToAvoidDiv, exerciseExternalResourcesDiv];
            outputDivs.forEach(div => { if (div) div.innerHTML = ''; });

            if (exerciseRecommendationsArea) exerciseRecommendationsArea.style.display = 'block';
            
            const doshaForExerciseRender = userProfile.dosha; 
            const ageForExercise = userProfile.age;
            const lowerCaseDoshaForDataLookup = userProfile.dosha.toLowerCase();

            if (!HubData.exerciseAdvisorData || !HubData.exerciseAdvisorData.doshaSpecifics || !HubData.exerciseAdvisorData.doshaSpecifics[lowerCaseDoshaForDataLookup] || !getExerciseAppAgeGroup(ageForExercise)) {
                if(errorDiv) errorDiv.textContent = "Exercise recommendation data not available for the selected profile. Ensure Exercise Data is fully populated.";
                return;
            }
            renderExerciseHowToUseGuide(); renderExerciseTHR(ageForExercise); renderExerciseWeeklyFrequencyByAge(ageForExercise);
            renderExerciseWorkoutCategoryPlans(); renderExerciseDoshaSpecificRecommendations(doshaForExerciseRender);
            renderExerciseGeneralNotes(); renderExerciseActionsToAvoid(); renderExerciseExternalResources();
        });
    } else { console.error("getExerciseRecommendationsBtn not found."); }

    if (hubStartStressSessionBtn) { 
        hubStartStressSessionBtn.addEventListener('click', startHubStressManagementSession);
    } else { console.error("hubStartStressSessionBtn not found."); }

    // ADD THIS NEW LISTENER:
    if (getVitalsFeedbackBtn) {
        getVitalsFeedbackBtn.addEventListener('click', getVitalsFeedback);
    } else { console.error("getVitalsFeedbackBtn not found."); }

    // --- Initial Setup ---
    if (userProfileSection) userProfileSection.style.display = 'block';
    if (mainNav) mainNav.style.display = 'none';
    if (appMainContent) appMainContent.style.display = 'none';
    if (hubSessionDurationSelect) populateStressSessionDurationDropdown(); 
    else {console.warn("hubSessionDurationSelect not found for initial population during Hub setup.")}

    console.log("AyurWellness Hub Initialized and Ready.");
});