var apiUrl = "http://localhost:8080/";
document.addEventListener('DOMContentLoaded', function(event) {
    loadTable(loadTableInsideClickEvents);

    document.querySelector(".close-button").addEventListener("click", hideModal);
    document.querySelector(".second-topbar .button.save").addEventListener("click", function(e){
        e.preventDefault();
        saveData("second-topbar");
    });

    document.querySelector('.search_input').addEventListener('keyup', delay(function(e) {
        var searchValue = encodeURIComponent(this.value);
        searchAndLoadTable(searchValue);
    }, 600));
});

function renderTable(callback, data, tableTbody){

    data.forEach(function(row, index){
        var lineNo = index + 1;
        var rowElement = document.createElement('TR');
        var cols = "<td>" + lineNo + "</td>";
        cols += "<td>" + row.name + "</td>";
        cols += "<td class='number'>" + row.age + "</td>";
        cols += "<td>" + row.department + "</td>";
        cols += "<td>" + row.city + "</td>";
        cols += "<td><button type='button' class='button green edit-btn' data-eid='" + row.id + "'>Edit</button></td>";
        cols += "<td><button type='button' class='button red delete-btn' data-did='" + row.id + "'>Delete</button></td>";
        rowElement.innerHTML = cols;
        tableTbody.appendChild(rowElement);
        if(data.length == index+1 && callback){
            callback()
        }
    });
}

function delay(callback, ms){

    var timer = 0;
    return function() {
      var context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        callback.apply(context, args);
      }, ms || 0);
    };
}

function loadTable(callback){

    var queryUrl = "";
    var searchValue = document.querySelector("input.search_input").value;
    if(searchValue && searchValue.trim().length > 0){
        queryUrl = "?search=" + searchValue;
    }
    fetch(apiUrl + 'api/fetch-all.php' + queryUrl)
    .then(function(data){
        return data.json();
    })
    .then(function(response){
        var tableTbody = document.querySelector(".table > tbody")
        tableTbody.textContent = '';
        if(response.status){
            var data = response.data;
            renderTable(callback, data, tableTbody)
        }else{
            var rowElement = document.createElement('TR');
            var cols = "<td colspan='6' class='message-column'>" + response.message + "</td>";
            rowElement.innerHTML = cols;
            tableTbody.appendChild(rowElement);
        }
    })
    .catch(function(x,y,z){
        console.log(x,y,z);
    });
}

function showModal(e, data){

    var eid = data.id;
    var modalLayouyElement = document.createElement("DIV", );
    var attrClass = document.createAttribute("class");
    attrClass.value = "modal-overlay";
    var attrId = document.createAttribute("id");
    attrId.value = "modal-overlay";
    modalLayouyElement.setAttributeNode(attrClass);
    modalLayouyElement.setAttributeNode(attrId);
    document.querySelector("body").appendChild(modalLayouyElement);

    document.getElementById("modal").classList.remove("closed");

    var inputs = ["name", "age", "department", "city"];
    var modalGuts = document.querySelector(".modal-guts");
    var titleElement = document.createElement("H1");
    titleElement.textContent = "Edit Record";
    modalGuts.appendChild(titleElement);
    inputs.forEach(function(value){
        var inputElContainer = getInputElement(value, data);
        modalGuts.appendChild(inputElContainer);
    });
    var saveButton = getButtonElement("Save", "", eid);
    modalGuts.appendChild(saveButton);

    document.querySelector(".modal-guts .button.save").addEventListener("click", function(e){
        e.preventDefault();
        saveData("modal-guts", eid);
    });
}

function hideModal(e){

    document.querySelector(".modal-overlay").remove();
    document.getElementById("modal").classList.add("closed");
    document.querySelector(".modal-guts").textContent="";
}

function loadTableInsideClickEvents(){

    var actionsButtons = [".table .edit-btn", ".table .delete-btn"];
    actionsButtons.forEach(function(selectorScope, index){

        var buttons = document.querySelectorAll(selectorScope);
        buttons.forEach(function(nodeElem){
    
            nodeElem.addEventListener("click", function(e){
                if(index === 0){
                    loadRecordDataInModal(e);
                }else{
                    deleteRecord(e);
                }
            });
        });
    });
}

function loadRecordDataInModal(e){

    var eid = e.target.attributes["data-eid"].value;
    var bodyData = {sid: eid}
    fetch(apiUrl + 'api/fetch-single.php', {
        method: "POST",
        body: JSON.stringify(bodyData),
    })
    .then(function(data){
        return data.json();
    })
    .then(function(response){
        console.log(response);
        if(response.status){
            var data = response.data;
            showModal(e, data)
        }else{
            toastr.error(response.message);
        }
    })
    .catch(function(x,y,z){
        console.log(x,y,z);
    });
}

function getInputElement(elementName, data){

    var inputElContainer = document.createElement("DIV");
    var attrClass = document.createAttribute("class");
    attrClass.value = "form-group";
    inputElContainer.setAttributeNode(attrClass);
    var labelEl = document.createElement("LABEL");
    var attrFor = document.createAttribute("for");
    attrFor.value = elementName;
    labelEl.setAttributeNode(attrFor);
    labelEl.textContent = elementName.charAt(0).toUpperCase() + elementName.slice(1);
    if(elementName === "name" || elementName === "age" || elementName === "department"){
        var starRedSpan = document.createElement("SPAN");
        attrClass = document.createAttribute("class");
        attrClass.value = "star-red";
        starRedSpan.setAttributeNode(attrClass);
        starRedSpan.textContent = "*"
        labelEl.appendChild(starRedSpan);
    }
    var inputOnlyContainer = document.createElement("DIV");
    var inputEl = document.createElement("INPUT");
    var attrName = document.createAttribute("name");
    attrName.value = elementName
    attrClass = document.createAttribute("class");
    attrClass.value = elementName;
    inputEl.setAttributeNode(attrClass);
    inputEl.setAttributeNode(attrName);
    inputEl.value = data[elementName];
    inputOnlyContainer.appendChild(inputEl);
    inputElContainer.appendChild(labelEl);
    inputElContainer.appendChild(inputOnlyContainer);

    return inputElContainer;
}

function getButtonElement(elementName, className, eid){

    var buttonElement = document.createElement("BUTTON");
    var attrClass = document.createAttribute("class");
    attrClass.value = "button " + className + " " + elementName.toLowerCase();
    var attrType = document.createAttribute("type");
    attrType.value = "button";
    var attrEid = document.createAttribute("data-eid");
    attrEid.value = eid;
    buttonElement.setAttributeNode(attrClass);
    buttonElement.setAttributeNode(attrType);
    buttonElement.setAttributeNode(attrEid);
    buttonElement.textContent = elementName;

    return buttonElement;
}

function saveData(parentClassName, eid){

    var name = document.querySelector("."+ parentClassName +" input.name").value;
    var city = document.querySelector("."+ parentClassName +" input.city").value;
    var age = document.querySelector("."+ parentClassName +" input.age").value;
    var department = document.querySelector("."+ parentClassName +" input.department").value;

    var bodyData = {sname: name, sage: age, scity: city, sdepartment: department}
    var apiEndpoint = apiUrl + 'api/insert.php'
    var methodName = "POST";
    if(eid){
        bodyData["sid"] = eid;
        apiEndpoint = apiUrl + 'api/update.php'
        methodName = "PUT";
    }

    fetch(apiEndpoint, {
        method: methodName,
        body: JSON.stringify(bodyData),
    })
    .then(function(data){
        return data.json();
    })
    .then(function(response){
        console.log(response);
        if(response.status){
            loadTable(loadTableInsideClickEvents);
            document.querySelector("."+ parentClassName +" input.name").value = "";
            document.querySelector("."+ parentClassName +" input.city").value = "";
            document.querySelector("."+ parentClassName +" input.age").value = "";
            document.querySelector("."+ parentClassName +" input.department").value = "";
            toastr.success(response.message);
            hideModal();
        }else{
            toastr.error(response.message);
        }
    })
    .catch(function(x,y,z){
        console.log(x,y,z);
    });
}

var toastr = {
    count: 0,
    error: function(message){
        
        var toastEl = this.buildTemplate("red");
        var messagePara = document.createElement("P");
        messagePara.textContent = message;
        toastEl.appendChild(messagePara);
        document.querySelector("body").appendChild(toastEl);
        this.remove(3000);
        this.count++;
    },
    success: function(message){

        var toastEl = this.buildTemplate("green");
        var messagePara = document.createElement("P");
        messagePara.textContent = message;
        toastEl.appendChild(messagePara);
        document.querySelector("body").appendChild(toastEl);
        this.remove(3000);
        this.count++;
    },
    buildTemplate: function(toastColor){

        var top = window.scrollY + 5;
        if(this.count > 0){
            top += (this.count * 85);
        }
        var toastEl = document.createElement("DIV");
        var attrClass = document.createAttribute("class");
        attrClass.value = "toastr-message";
        toastEl.setAttributeNode(attrClass);
        var attrStyle = document.createAttribute("style");
        var styleText = "position: absolute; top: "+ top +"px; right: 5px;";
        styleText += "background-color: "+toastColor+"; color: white;";
        styleText += "width: 300px;box-shadow: 1px 2px 6px #333;";
        styleText += "padding: 10px; border-radius: 5px;";
        attrStyle.value = styleText;
        toastEl.setAttributeNode(attrClass);
        toastEl.setAttributeNode(attrStyle);

        return toastEl;
    },
    remove: function(timeoutMs){
        var context = this;
        setTimeout(function(){
            document.querySelector(".toastr-message").remove();
            context.count--;
        }, timeoutMs);
    }
}

function deleteRecord(e){

    if(confirm("Are you sure to delete the Record?")){

        var did = e.target.attributes["data-did"].value;
        var bodyData = {sid: did}
        fetch(apiUrl + 'api/delete.php', {
            method: "DELETE",
            body: JSON.stringify(bodyData),
        })
        .then(function(data){
            return data.json();
        })
        .then(function(response){
            console.log(response);
            if(response.status){
                loadTable(loadTableInsideClickEvents);
                toastr.success(response.message);
            }else{
                toastr.error(response.message);
            }
        })
        .catch(function(x,y,z){
            console.log(x,y,z);
        });
    }
}

function searchAndLoadTable(searchValue){

    fetch(apiUrl + 'api/search.php?search=' + searchValue)
    .then(function(data){
        return data.json();
    })
    .then(function(response){
        
        var tableTbody = document.querySelector(".table > tbody")
        tableTbody.textContent = '';
        if(response.status){
            var data = response.data;
            renderTable(loadTableInsideClickEvents, data, tableTbody)
        }else{
            var rowElement = document.createElement('TR');
            var cols = "<td colspan='6' class='message-column'>" + response.message + "</td>";
            rowElement.innerHTML = cols;
            tableTbody.appendChild(rowElement);
            toastr.error(response.message);
        }
    })
    .catch(function(x,y,z){
        console.log(x,y,z);
    });
}