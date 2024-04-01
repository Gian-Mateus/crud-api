const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

//Estou pondo um "timer" no popover para que ele só apareça por dois segundos
const popoverHideFocus = document.querySelector('input');
popoverHideFocus.addEventListener('focus', function() {
    this.setAttribute('data-bs-toggle', 'popover');

    const popover = new bootstrap.Popover(this); 

    setTimeout(function() {
        popover.hide();
    }, 2000);
});

//exibir "pop-up" de sucesso ao adicionar animal
const showToast = (toastShow) => {
    const myToast = new bootstrap.Toast(document.querySelector(toastShow));
    myToast.show();
}

// pegando os IDs dos botões e das suas repectivas linhas de manipulação
const btnAll = ["#btnSearch","#btnAdd","#btnUp","#btnCDel", "#btnList"];
const rowsAll = ["#rowSearch", "#rowNew", "#rowUpdate", "#rowDelete", "#rowList"];

//função que tirará a classe form-general das linhas conforme o evento de cada botão e adicionará a classe nas outras linhas que não estão sendo usadas
const openLayout = (rowID) => {
    const rowCalled = document.querySelector(rowID);
    rowCalled.classList.remove("form-general");

    const newRowsAll = removeItem(rowsAll, rowID);

    newRowsAll.forEach(newRow => {
        const row = document.querySelector(newRow);
        row.classList.add("form-general");
    });
}

//função para remover item de um array como se fosse um pesquisar, obs.: retorna um array sem o ítem removido
const removeItem = (array, element) => {
    return newArray = array.filter((item) => item !== element)
}
// atribuindo as funções criadas para o evento click de cada botão
btnAll.forEach((btn, index) => {
    document.querySelector(btn).addEventListener('click', () => {
        openLayout(rowsAll[index]);
    });
});
// evita que recarregue a página com a ação submit do botões nos forms
const forms = document.querySelectorAll("form");
forms.forEach(function(form) {
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Isso evita a submissão padrão do formulário
    });
});

const sendRequest = async (url, method, body) => {
    try {
        const response = await fetch(url, {
            method,
            headers: {
            "Content-type": "application/json; charset=UTF-8"
            },
            body
        });

        if (!response.ok) {
        throw new Error("Erro na requisição! Verifique os dados informados.");
        }
        return await response.json();

    } catch (error) {
        document.querySelector("#toast").classList.remove("bg-succes");
        document.querySelector("#toast").classList.add("bg-danger");
        showToast("#toast");
        document.querySelector(".toast-body").innerText = error.message;
    }
}

//Botão de pesquisar com a lupa, já faz a requisição para api e retorna na tela
const btnSearchAPI = document.querySelector("#searchID");
btnSearchAPI.addEventListener('click', () => {
    const valueInput = document.querySelector("#idSearch").value;

    sendRequest(`http://cafepradev.com.br:21020/animals/search/${valueInput}`, "GET")
    .then((data) => {
        const structure = `<tr>
                            <th>${data.name}</th>
                            <th>${data.species}</th>
                            <th>${data.color}</th>
                            <th>${data.size}</th>
                        </tr>`;

        document.querySelector("#tablebody").innerHTML = structure;
    })
})
// ação do botão de lista, faz a requisição para API e traz toda a informação do json como tabela
document.querySelector(btnAll[4]).addEventListener("click", () => {
    openLayout(rowsAll[4])
    sendRequest("http://cafepradev.com.br:21020/animals/list", "GET")
    .then((data) => {
        let structure = '';
        data.forEach(animal => {
            structure += `<tr>
                            <th>${animal.id}</th>
                            <th>${animal.name}</th>
                            <th>${animal.species}</th>
                            <th>${animal.color}</th>
                            <th>${animal.size}</th>
                        </tr>`;
                    })
                document.querySelector("#tableList").innerHTML = structure;
    });
});

//botão adicionar animal
document.querySelector("#btnNew").addEventListener('click', () => {
    const newAnimal = {
        name: document.querySelector("#nameNew").value,
        species: document.querySelector("#speciesNew").value,
        color: document.querySelector("#colorNew").value,
        size: document.querySelector("#sizeNew").value
    }
    
    sendRequest("http://cafepradev.com.br:21020/animals/insert", "POST" , JSON.stringify(newAnimal))
    .then(() => {
        document.querySelector("#toast").classList.remove("bg-danger");
        document.querySelector("#toast").classList.add("bg-success");
        document.querySelector(".toast-body").innerText = "Animal adicionado com sucesso!";
        showToast("#toast");
    })
})
//para atualizar, primeiro ele vai buscar as informações do animal segundo o ID, traz as informações para os inputs
//depois o usuário muda as informações do input e põe no botão de atualizar
const searForUpdate = document.querySelector("#idUpdate");
const animal = {
    name: document.querySelector("#nameUpdate"),
    species: document.querySelector("#speciesUpdate"),
    color:  document.querySelector("#colorUpdate"),
    size:  document.querySelector("#sizeUpdate")
}
searForUpdate.addEventListener("blur", function(){
    sendRequest(`http://cafepradev.com.br:21020/animals/search/${this.value}`, "GET")
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

document.querySelector("#btnPut").addEventListener('click', function(){
    sendRequest("http://cafepradev.com.br:21020/animals/update", "PUT" ,JSON.stringify({
            id: searForUpdate.value,
            name: animal.name.value,
            species: animal.species.value,
            color: animal.color.value,
            size: animal.size.value
        }))
    .then(() => {
        document.querySelector("#toast").classList.remove("bg-danger");
        document.querySelector("#toast").classList.add("bg-success");
        document.querySelector(".toast-body").innerText = "Animal atualizado com sucesso!";
        showToast("#toast");
    })
})

//Função de deletar!
let deleteAnimal = document.querySelector("#btnDelete");
deleteAnimal.addEventListener("click", function(){
    let valueInput = document.querySelector("#idSearchDelete").value
    sendRequest(" http://cafepradev.com.br:21020/animals/delete", "DELETE", JSON.stringify({
            id: valueInput
        }) )
    .then(() => {
        document.querySelector("#toast").classList.remove("bg-danger");
        document.querySelector("#toast").classList.add("bg-success");
        document.querySelector(".toast-body").innerText = "Animal deletado com sucesso!";
        showToast("#toast");
    });
});