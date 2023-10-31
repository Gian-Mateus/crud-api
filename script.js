const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

//Estou pondo um "timer" no popover para que ele só apareça por dois segundos
const popoverHideFocus = document.querySelector('input');
popoverHideFocus.addEventListener('focus', function() {
    this.setAttribute('data-bs-toggle', 'popover');

    let popover = new bootstrap.Popover(this); 

    setTimeout(function() {
        popover.hide();
    }, 2000);
});

// pegando os IDs dos botões e das suas repectivas linhas de manipulação
let btnAll = ["#btnSearch","#btnAdd","#btnUp","#btnCDel", "#btnList"];
let rowsAll = ["#rowSearch", "#rowNew", "#rowUpdate", "#rowDelete", "#rowList"];

//função que tirará a classe form-general das linhas conforme o evento de cada botão e adicionará a classe nas outras linhas que não estão sendo usadas
const openLayout = (rowID) => {
    let rowCalled = document.querySelector(rowID);
    rowCalled.classList.remove("form-general");
    let newRosAll = removeItem(rowsAll, rowID);
    for(pos in newRosAll){
        let row = document.querySelector(newRosAll[pos])
        row.classList.add("form-general")
    };
};
//função para remover item de um array como se fosse um pesquisar, obs.: retorna um array sem o ítem removido
const removeItem = (array, element) => {
    const index = array.indexOf(element);
    if (index !== -1) {
        array = [...array.slice(0, index), ...array.slice(index + 1)];
    }
    return array;
};
// atribuindo as funções criadas para o evento click de cada botão
let btnSearch = document.querySelector(btnAll[0]);
btnSearch.addEventListener('click', function(){
    openLayout(rowsAll[0])
});
let btnAdd = document.querySelector(btnAll[1]);
btnAdd.addEventListener('click', function(){
    openLayout(rowsAll[1])
});
let btnUp = document.querySelector(btnAll[2]);
btnUp.addEventListener('click', function(){
    openLayout(rowsAll[2])
});
let btnCDel = document.querySelector(btnAll[3]);
btnCDel.addEventListener('click', function(){
    openLayout(rowsAll[3])
});
// evita que recarregue a página com a ação submit do botões nos forms
const forms = document.querySelectorAll("form");
forms.forEach(function(form) {
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Isso evita a submissão padrão do formulário
    });
});

//Botão de pesquisar com a lupa, já faz a requisição para api e retorna na tela
let btnSearchAPI = document.querySelector("#searchID");
btnSearchAPI.addEventListener('click', function(){
    let valueInput = document.querySelector("#idSearch").value

    fetch(`http://cafepradev.com.br:21020/animals/search/${valueInput}`)
    .then(ret => ret.json())
    .then((data) => {
        let structure = `<tr>
                            <th>${data.name}</th>
                            <th>${data.species}</th>
                            <th>${data.color}</th>
                            <th>${data.size}</th>
                        </tr>`

        document.querySelector("#tablebody").innerHTML = structure;
    })
})
// ação do botão de lista, faz a requisição para API e traz toda a informação do json como tabela
let btnList = document.querySelector(btnAll[4]);
btnList.addEventListener("click", () => {
    openLayout(rowsAll[4])
    fetch("http://cafepradev.com.br:21020/animals/list")
    .then(ret => ret.json())
    .then((data) => {
        console.log(data);
        let structure = '';
        for(pos in data){
            structure += `
                        <tr>
                            <th>${data[pos].id}</th>
                            <th>${data[pos].name}</th>
                            <th>${data[pos].species}</th>
                            <th>${data[pos].color}</th>
                            <th>${data[pos].size}</th>
                        </tr>
                        `
                    }
                document.querySelector("#tableList").innerHTML = structure;
    })
})

//exibir "pop-up" de sucesso ao adicionar animal
const showToast = (toastShow) => {
    const myToast = document.querySelector(toastShow);
    const toast = new bootstrap.Toast(myToast);
    toast.show();
}
//botão adicionar animal
let btnNew = document.querySelector("#btnNew")
btnNew.addEventListener('click', () => {
    let newAnimal = {
        name: document.querySelector("#nameNew").value,
        species: document.querySelector("#speciesNew").value,
        color: document.querySelector("#colorNew").value,
        size: document.querySelector("#sizeNew").value
    }
    
    fetch("http://cafepradev.com.br:21020/animals/insert", {
        method: "POST",
        headers : {
            "Content-type" : "application/json; charset=UTF-8"
        },
        body : JSON.stringify({
            "name": newAnimal.name,
            "species": newAnimal.species,
            "color": newAnimal.color,
            "size": newAnimal.size
        }) 
    })
    .then(ret => {
        if(!ret){
            throw new Error("Erro na requisição! Verifique os dados informados")
        }
        return ret.json()
    })
    .then(data => {
        showToast("#toastSuccess");
    })
    .catch(error => {
        let infoToast = document.querySelector(".toast-body");
        infoToast.innerHTML = error
    })
})
//para atualizar, primeiro ele vai buscar as informações do animal segundo o ID, trazer as informações para os inputs
//depois o usuário muda as informações do input e põe no botão de atualizar
const searForUpdate = document.querySelector("#idUpdate");
let animal = {
    name: document.querySelector("#nameUpdate"),
    species: document.querySelector("#speciesUpdate"),
    color:  document.querySelector("#colorUpdate"),
    size:  document.querySelector("#sizeUpdate")
}
searForUpdate.addEventListener("blur", function(){
    fetch(`http://cafepradev.com.br:21020/animals/search/${this.value}`)
    .then(ret => ret.json())
    .then(data => {
        animal.name.value = data.name;
        animal.species.value = data.species;
        animal.color.value = data.color;
        animal.size.value = data.size;
        animal.name.focus();
        animal.species.focus();
        animal.color.focus();
        animal.size.focus();
    })
})
const updateAnimal = document.querySelector("#btnPut");
updateAnimal.addEventListener('click', function(){
    fetch("http://cafepradev.com.br:21020/animals/update", {
        method: "PUT",
        headers : {
            "Content-type" : "application/json; charset=UTF-8"
        },
        body : JSON.stringify({
            "id": searForUpdate.value,
            "name": animal.name.value,
            "species": animal.species.value,
            "color": animal.color.value,
            "size": animal.size.value
        }) 
    })
    .then(ret => {
        if(!ret){
            throw new Error("Erro na requisição! Verifique os dados informados")
        }
        return ret.json()
    })
    .then(data => {
        showToast("#toastSuccessUpdate");
    })
    .catch(error => {
        let infoToast = document.querySelector(".toast-body");
        infoToast.innerHTML = error
    })
})

//Função de deletar!
let deleteAnimal = document.querySelector("#btnDelete");
deleteAnimal.addEventListener("click", function(){
    let valueInput = document.querySelector("#idSearchDelete").value
    fetch(" http://cafepradev.com.br:21020/animals/delete", {
        method: "DELETE",
        headers : {
            "Content-type" : "application/json; charset=UTF-8"
        },
        body : JSON.stringify({
            "id": valueInput,
        }) 
    })
    .then(ret => {
        if(!ret){
            throw new Error("Erro na requisição! Verifique os dados informados")
        }
        return ret.json()
    })
    .then(data => {
        showToast("#toastSuccessDelete");
    })
    .catch(error => {
        let infoToast = document.querySelector(".toast-body");
        infoToast.innerHTML = error
    })
})