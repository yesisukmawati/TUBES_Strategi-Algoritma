const foods = [
    { name: "Nasi + Ayam", price: 15000, protein: 24.00 },
    { name: "Mie + Telur", price: 13000, protein: 4.54 },
    { name: "Gado-gado", price: 15000, protein: 6.10 },
    { name: "Soto Ayam", price: 12000, protein: 24.01 },
    { name: "Nasi Uduk", price: 20000, protein: 4.07 },
    { name: "Nasi goreng", price: 15000, protein: 6.3 },
    { name: "Bubur Ayam", price: 15000, protein: 27.56 },
    { name: "Mie Bakso", price: 12000, protein: 20.24 },
    { name: "Sup Mie Daging Sapi", price: 30000, protein: 4.83 },
    { name: "Ikan Patin bakar", price: 40000, protein: 17.50 },
    { name: "Mie ayam", price: 20000, protein: 6.20 },
    { name: "Ayam, ampela, goreng", price: 17000, protein: 32.30 },
    { name: "Telur", price: 3000, protein: 10.80 },  
    { name: "Soto Daging", price: 25000, protein: 18.25 },
    { name: "Pisang goreng", price: 3000, protein: 0.4 },
];

const maxProtein = 1000;
const maxItems = 3;

function findBestMealBacktracking(foods, budget, maxProtein, maxItems) {
    const bestMeal = { items: [], protein: 0, cost: 0 };

    function backtrack(index, currentMeal, currentProtein, currentCost) {
        if (index === foods.length || currentMeal.length === maxItems) {
            if (currentProtein > bestMeal.protein && currentCost <= budget) {
                bestMeal.items = [...currentMeal];
                bestMeal.protein = currentProtein;
                bestMeal.cost = currentCost;
            }
            return;
        }

        if (currentCost + foods[index].price <= budget && currentProtein + foods[index].protein <= maxProtein) {
            currentMeal.push(foods[index].name);
            backtrack(index + 1, currentMeal, currentProtein + foods[index].protein, currentCost + foods[index].price);
            currentMeal.pop();
        }

        backtrack(index + 1, currentMeal, currentProtein, currentCost);
    }

    backtrack(0, [], 0, 0);
    return bestMeal;
}

function findBestMealBranchAndBound(foods, budget, maxProtein, maxItems) {
    const bestMeal = { items: [], protein: 0, cost: 0 };

    function bound(index, currentProtein, currentCost, remainingBudget) {
        let upperBound = currentProtein;
        let i = index;
        while (i < foods.length && currentCost + foods[i].price <= remainingBudget && currentProtein + foods[i].protein <= maxProtein) {
            upperBound += foods[i].protein;
            currentCost += foods[i].price;
            i++;
        }
        return upperBound;
    }

    function branchAndBound(index, currentMeal, currentProtein, currentCost) {
        if (index === foods.length || currentMeal.length === maxItems) {
            if (currentProtein > bestMeal.protein && currentCost <= budget) {
                bestMeal.items = [...currentMeal];
                bestMeal.protein = currentProtein;
                bestMeal.cost = currentCost;
            }
            return;
        }

        const remainingBudget = budget - currentCost;
        const upperBound = bound(index, currentProtein, currentCost, remainingBudget);

        if (upperBound <= bestMeal.protein) {
            return;
        }

        if (currentCost + foods[index].price <= budget && currentProtein + foods[index].protein <= maxProtein) {
            currentMeal.push(foods[index].name);
            branchAndBound(index + 1, currentMeal, currentProtein + foods[index].protein, currentCost + foods[index].price);
            currentMeal.pop();
        }

        branchAndBound(index + 1, currentMeal, currentProtein, currentCost);
    }

    branchAndBound(0, [], 0, 0);
    return bestMeal;
}

const budget = 20000;
const affordableFoods = foods.filter(food => food.price <= budget);

// Testing Backtracking
const bestMealBacktracking = findBestMealBacktracking(affordableFoods, budget, maxProtein, maxItems);
console.log("Best Meal (Backtracking):", bestMealBacktracking);

// Displaying Backtracking Result
const backtrackingResult = document.getElementById('foodList');
if (backtrackingResult) {
    backtrackingResult.innerHTML = `<h2>Best Meal (Backtracking)</h2><p>Items: ${bestMealBacktracking.items.join(', ')}</p><p>Protein: ${bestMealBacktracking.protein}</p><p>Cost: ${bestMealBacktracking.cost}</p>`;
} else {
    console.error('Element with id "foodList" not found');
}

// Testing Branch and Bound
const bestMealBranchAndBound = findBestMealBranchAndBound(affordableFoods, budget, maxProtein, maxItems);
console.log("Best Meal (Branch and Bound):", bestMealBranchAndBound);

// Displaying Branch and Bound Result
const branchAndBoundResult = document.getElementById('bestMeal');
if (branchAndBoundResult) {
    branchAndBoundResult.innerHTML = `<h2>Best Meal (Branch and Bound)</h2><p>Items: ${bestMealBranchAndBound.items.join(', ')}</p><p>Protein: ${bestMealBranchAndBound.protein}</p><p>Cost: ${bestMealBranchAndBound.cost}</p>`;
} else {
    console.error('Element with id "bestMeal" not found');
}
