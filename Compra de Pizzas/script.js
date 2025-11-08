//console.log();


let cart = [];
let modalQtd = 1;
let indicePizzaClicada;


pizzaJson.map((item, index) => {
    let pizzaItem = document.querySelector(".models .pizza-item").cloneNode(true);
    pizzaItem.setAttribute("data-key", index);    
    pizzaItem.querySelector(".pizza-item--img img").src = item.img;
    pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
    pizzaItem.querySelector(".pizza-item--price").innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;

    pizzaItem.querySelector("a").addEventListener("click", (event) => {

        event.preventDefault();

        modalQtd = 1;

        let indice = event.target.closest(".pizza-item").getAttribute("data-key");
        indicePizzaClicada = indice;

        document.querySelector(".pizzaBig img").src = pizzaJson[indice].img;
        document.querySelector(".pizzaInfo h1").innerHTML = pizzaJson[indice].name;
        document.querySelector(".pizzaInfo--desc").innerHTML = pizzaJson[indice].description;
        document.querySelector(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[indice].price.toFixed(2)}`; 
    
        document.querySelector(".pizzaInfo--size.selected").classList.remove("selected");
        document.querySelectorAll(".pizzaInfo--size").forEach((size, sizeIndex) => {
            if(sizeIndex === 2) {
                size.classList.add("selected");
            }
            size.querySelector("span").innerHTML = pizzaJson[indice].sizes[sizeIndex];
        });

        document.querySelector(".pizzaInfo--qt").innerHTML = modalQtd;

        document.querySelector(".pizzaWindowArea").style.opacity = 0;        
        document.querySelector(".pizzaWindowArea").style.display = "flex";
        setTimeout(() => {
            document.querySelector(".pizzaWindowArea").style.opacity = 1;    
        }, 200);       

    });   

    document.querySelector(".pizza-area").append(pizzaItem);
});

document.querySelectorAll(".pizzaInfo--size").forEach((size, sizeIndex) => {
    size.addEventListener("click", () => {
        document.querySelector(".pizzaInfo--size.selected").classList.remove("selected");
        size.classList.add("selected");
    });
});

document.querySelector(".pizzaInfo--qtmais").addEventListener("click", () => {
    modalQtd++;
    document.querySelector(".pizzaInfo--qt").innerHTML = modalQtd;
});
document.querySelector(".pizzaInfo--qtmenos").addEventListener("click", () => {
    if(modalQtd > 1) {
        modalQtd--;
        document.querySelector(".pizzaInfo--qt").innerHTML = modalQtd;
    }
});

function closeModal() {
    document.querySelector(".pizzaWindowArea").style.opacity = 0;      
    setTimeout(() => {
        document.querySelector(".pizzaWindowArea").style.display = "none"; 
    }, 200);    
}

document.querySelectorAll(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach((item) => {
    item.addEventListener("click", closeModal);
})

document.querySelector(".pizzaInfo--addButton").addEventListener("click", () => {

    //recupera o objeto inteiro da pizza clicada
    let pizzaClicada = pizzaJson[indicePizzaClicada];
    console.log(pizzaClicada);

    //recupera o tamanho da pizza clicada
    let size = parseInt(document.querySelector(".pizzaInfo--size.selected").getAttribute("data-key"));
    console.log("Tamanho: " + size);    

    //cria identificador único para pizza (id+size)
    let identifier = pizzaJson[indicePizzaClicada].id + "@" + size;    

    //procura se no cart já existe uma pizza com o mesmo identificador que o meu (referente a pizza clicada)
    //(retorna o index -1 se não encontrou, ou o próprio indice se encontrou)
    let key = cart.findIndex((item) => item.identifier === identifier);

    if(key > -1) {
        cart[key].qtd += modalQtd;
    } else {
        cart.push({
            identifier: identifier,
            id: pizzaJson[indicePizzaClicada].id,
            size: size,
            qtd: modalQtd
        });
    } 
    

    /*
       
    */

    updateCart();
    closeModal();
    
})


function updateCart() {
    if(cart.length > 0 ) {
        document.querySelector("aside").classList.add("show");
        document.querySelector(".cart").innerHTML = "";

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id === cart[i].id);   //find() retorna o objeto!!!
            subtotal += pizzaItem.price * cart[i].qtd;

            let cartItem = document.querySelector(".cart--item").cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = "P";
                    break;
                case 1: 
                    pizzaSizeName = "M";
                    break;
                case 2: 
                    pizzaSizeName = "G";
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            cartItem.querySelector("img").src = pizzaItem.img;
            cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName;
            cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qtd;

            cartItem.querySelector(".cart--item-qtmais").addEventListener("click", () => {
                cart[i].qtd++;
                updateCart();
            });
            cartItem.querySelector(".cart--item-qtmenos").addEventListener("click", () => {
                if(cart[i].qtd > 1) {
                    cart[i].qtd--;                    
                } else {
                    cart.splice(i, 1);
                    document.querySelector("aside").classList.remove("show");
                }
                updateCart();                
            });


            desconto = subtotal * 0.1;
            total = subtotal - desconto;

            document.querySelector(".cart--totalitem.subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`;
            document.querySelector(".cart--totalitem.desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`;
            document.querySelector(".cart--totalitem.total.big span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;


            document.querySelector(".cart").append(cartItem);
        }

    } else {
        document.querySelector("aside").classList.remove("show");
    }

    
    
}

//console.log(pizzaItem);










//Funcionalidades apara quando clicar no botão de adicionar ao carrinho:
// - recuperar o objeto inteiro da pizza clicada
// - recuperar o tamanho da pizza clicada
// - criar um identificador único para pizzas
// - verificar se no cart já existe uma pizza com o mesmo identificador que o da pizza clicada
//   (se sim apenas somar a qtd, se não adicionar nova pizza ao cart)
// - Dar push dentro do cart com essas infos
// - Atualizar o carrinho  (levar os dados carregados do modal para abrir o carrinho)
// - Fechar o modal pizza


//Funcionalidades da função UpdateCart()
// - Condicional para abrir o carrinho: se houver itens no array cart, abre o modal do carrinho, se não, fecha
// - Criar as variáveis referente aos valores
// - Limpar a estrutura do .cart antes de fazer o laço para iterar o carrinho (pizzas se multiplicariam)
// - Laço para percorrer todos os itens do cart e mostrar no modal do carrinho
// - Procura o pizzaJson qual dos seus itens tem o mesmo id que o meu item do carrinho e retorna o seu objeto.
// - Armazena o objeto retornado numa variável contendo o objeto inteiro do item do carrinho
// - Clona a estrutura modelo para preencher os dados do modal carrinho e salva numa variável
// - Preenche os dados do modal carrinho a partir da variável que está carregando a estrutura dinamica
// - Adiciona a estrutura clonada e agora preenchida no local correto do html
















































