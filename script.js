let page = "home"
page = "equipamentos"

$(document).ready(function () {
    $loadContent(page)
})

$loadContent = function ($page, $args = false) {
    if ($page === "home") {
        $loadContentHome()
    } else if ($page === "equipamentos") {
        $loadContentEquipamentos()
    }
}

$loadContentHome = async function () {
    if ($(".col-12").find("table").length === 0) {
        $(".col-12").empty()
        let tb = "<table class='table table-responsive'>"
        tb += "<thead>"
        tb += "    <th>Equipamento</th>"
        tb += "    <th>Localização</th>"
        tb += "    <th>Interface</th>"
        tb += "    <th>Alcance Módulo</th>"
        tb += "    <th>Onda</th>"
        tb += "    <th>Operação</th>"
        tb += "    <th>Rx</th>"
        tb += "    <th>Referência</th>"
        tb += "    <th>Tx</th>"
        tb += "    <th>Referência</th>"
        tb += "    <th>Equipamento destino</th>"
        tb += "    <th>Rx Power Low Threshold</th>"
        tb += "    <th>Tx Power Low Threshold</th>"
        tb += "</thead>"
        tb += "    <tbody>"
        tb += "    </tbody>"
        tb += "</table>"
        $(".col-12").append(tb)
    }

    $("tbody").empty()
    const result = await $request("get", null, { "page": "home" });
    if (!result) { return }
    result.dados.map((element, index) => {
        if (element.equipamento_nome && element.interface) {
            locationURL = $findURLInText(element.localizacao)
            rxAlarm = (element.Rxthreshold - element.rx)
            txAlarm = (element.Txthreshold - element.tx)
            tr = "<tr>"
            tr += `<td>${element.equipamento_nome}</td>`
            tr += `<td>${locationURL.length > 0 ? '<a target="_blank" href="' + locationURL + '">' + element.localizacao.replace(/\[.*?\]/g, "") + '</a>' : element.localizacao}</td>`
            tr += `<td>${element.interface}</td>`
            tr += `<td>${element.alcance} km</td>`
            tr += `<td>${element.onda} nm</td>`
            tr += `<td>${element.operacao}</td>`
            tr += `<td>${element.rx}</td>`
            tr += `<td class=${rxAlarm <= 5 ? (rxAlarm <= 3 ? 'table-danger' : 'table-warning') : ""}>${rxAlarm}</td>`
            tr += `<td>${element.tx}</td>`
            tr += `<td class=${txAlarm <= 5 ? (txAlarm <= 3 ? 'table-danger' : 'table-warning') : ""}>${txAlarm}</td>`
            tr += `<td>${element.destino}</td>`
            tr += `<td>${element.Rxthreshold}</td>`
            tr += `<td>${element.Txthreshold}</td>`
            tr += `</tr>`
            $("tbody").append(tr)
        }
    })
}

$loadContentEquipamentos = async function () {
    if ($(".col-12").find("table").length === 0) {
        $(".col-12").empty()
        let tb = "<table class='table table-responsive'>"
        tb += "<thead>"
        tb += "    <th>Equipamento</th>"
        tb += "    <th>Localização</th>"
        tb += "    <th>Interface</th>"
        tb += "    <th>Alcance Módulo</th>"
        tb += "    <th>Onda</th>"
        tb += "    <th>Operação</th>"
        tb += "    <th>Rx</th>"
        tb += "    <th>Referência</th>"
        tb += "    <th>Tx</th>"
        tb += "    <th>Referência</th>"
        tb += "    <th>Equipamento destino</th>"
        tb += "    <th>Rx Power Low Threshold</th>"
        tb += "    <th>Tx Power Low Threshold</th>"
        tb += "</thead>"
        tb += "    <tbody>"
        tb += "    </tbody>"
        tb += "</table>"
        $(".col-12").append(tb)
    }

    $("tbody").empty()
    const result = await $request("get", null, { "page": "home" });
    if (!result) { return }
    result.dados.map((element, index) => {
        if (element.equipamento_nome && element.interface) {
            locationURL = $findURLInText(element.localizacao)
            rxAlarm = (element.Rxthreshold - element.rx)
            txAlarm = (element.Txthreshold - element.tx)
            tr = "<tr>"
            tr += `<td>${element.equipamento_nome}</td>`
            tr += `<td>${locationURL.length > 0 ? '<a target="_blank" href="' + locationURL + '">' + element.localizacao.replace(/\[.*?\]/g, "") + '</a>' : element.localizacao}</td>`
            tr += `<td>${element.interface}</td>`
            tr += `<td>${element.alcance} km</td>`
            tr += `<td>${element.onda} nm</td>`
            tr += `<td>${element.operacao}</td>`
            tr += `<td>${element.rx}</td>`
            tr += `<td class=${rxAlarm <= 5 ? (rxAlarm <= 3 ? 'table-danger' : 'table-warning') : ""}>${rxAlarm}</td>`
            tr += `<td>${element.tx}</td>`
            tr += `<td class=${txAlarm <= 5 ? (txAlarm <= 3 ? 'table-danger' : 'table-warning') : ""}>${txAlarm}</td>`
            tr += `<td>${element.destino}</td>`
            tr += `<td>${element.Rxthreshold}</td>`
            tr += `<td>${element.Txthreshold}</td>`
            tr += `</tr>`
            $("tbody").append(tr)
        }
    })
}

$request = function (type = "get", endpoint = null, data = {}) {
    return $.ajax(
        { url: `http://127.0.0.1${endpoint ? "/".concat(endpoint) : ""}`, method: type, data: data, dataType: "json", }
    ).then(result => {
        if (result?.type === "error" || result == null) {
            $alerts(result.msg, result.type)
            return
        }
        return result
    }).fail(err => {
        $alerts(err.statusText || "Erro desconhecido", "crítico")
        return
    })
}

$alerts = function (msg, type, $duration = 5) {
    if (type === "crítico") {
        mensagens = {
            "parsererror": "Resposta da API veio em forma diferente de JSON"
        }
        if (mensagens[msg]) {
            msg = mensagens[msg]
        } else {
            msg = "Ocorreu um erro crítico"
        }
    }

    console.log(msg)
}

$findURLInText = function (text) {
    const padrao = /<([^>]+)>/g;

    let resultado = [];
    let match;

    while ((match = padrao.exec(text)) !== null) {
        resultado.push(match[1]);
    }

    return resultado;
}