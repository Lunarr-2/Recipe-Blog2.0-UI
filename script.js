function renderDetail(recipe) {
  const detail = document.getElementById("recipe-detail");
  const titleEl = document.getElementById("detail-title");
  const metaEl = document.getElementById("detail-meta");
  const stepsEl = document.getElementById("detail-instructions");

  if (!detail || !titleEl || !metaEl || !stepsEl) return;

  titleEl.textContent = recipe.title || "Recipe";

  const servingsText = recipe.servings ? `Serves ${recipe.servings}` : "";
  const prepTime = recipe.prep_time || recipe.prepTime;
  const cookTime = recipe.cook_time || recipe.cookTime;

  const metaParts = [];
  if (servingsText) metaParts.push(servingsText);
  if (prepTime) metaParts.push(`Prep: ${prepTime}`);
  if (cookTime) metaParts.push(`Cook: ${cookTime}`);

  metaEl.textContent = metaParts.join(" · ");

  stepsEl.innerHTML = "";

  let instructions = recipe.instructions || recipe.steps || recipe.method;
  if (Array.isArray(instructions)) {
    instructions.forEach(step => {
      const li = document.createElement("li");
      li.textContent = step;
      stepsEl.appendChild(li);
    });
  } else if (typeof instructions === "string") {
    // Split by line breaks or numbered steps
    const parts = instructions
      .split(/\r?\n/)
      .map(s => s.trim())
      .filter(Boolean);

    parts.forEach(step => {
      const li = document.createElement("li");
      li.textContent = step;
      stepsEl.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "Instructions are not available for this recipe yet.";
    stepsEl.appendChild(li);
  }

  detail.classList.remove("hidden");
  detail.scrollIntoView({ behavior: "smooth", block: "start" });
}

function attachDetailClose() {
  const closeBtn = document.getElementById("detail-close");
  const detail = document.getElementById("recipe-detail");
  if (!closeBtn || !detail) return;

  closeBtn.addEventListener("click", () => {
    detail.classList.add("hidden");
  });
}

function fetchRecipes() {
  fetch("https://recipeblog2-0.onrender.com/api/recipes/")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("recipes");
      container.innerHTML = "";

      data.forEach(recipe => {
        const div = document.createElement("div");
        div.className = "recipe";
        div.innerHTML = `
          <h3>${recipe.title}</h3>
          <p><strong>Servings:</strong> ${recipe.servings}</p>
          <p>${recipe.description}</p>
          <h4>Ingredients:</h4>
          <ul>${recipe.ingredients
            .map(
              i =>
                `<li class="ingredient">${i.quantity} ${i.unit} ${i.name}</li>`
            )
            .join("")}</ul>
        `;

        div.addEventListener("click", () => renderDetail(recipe));
        container.appendChild(div);
      });
    })
    .catch(err => console.log(err));
}

// Initialize on page load
attachDetailClose();
fetchRecipes();