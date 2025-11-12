let page = "home"
page = "equipamentos"
page = "histórico"

$(document).ready(function () {

    $loadContent(page)

    $detectActions();
})

$loadContent = function ($page, $args = false) {
    if ($page === "home") {
        $loadContentHome()
    } else if ($page === "equipamentos") {
        $loadContentEquipamentos()
    } else if ($page === "histórico") {
        $loadContentEquipamentos()
    }
}

$loadContentHome = async function () {
    if ($("#content").find(".home").length === 0) {
        $("#content").empty()
        let tb = "<div class='table-responsive'>"
        tb += "<table class='table home'>"
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
        tb += "</div>"
        $("#content").append(tb)
    } else {
        $("#content tbody").empty()
    }

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
    if ($("#content").find(".equipamentos").length === 0) {
        $("#content").empty()
        let tb = "<div class='table-responsive'>"
        tb += "<table class='table equipamentos'>"
        tb += "<thead>"
        tb += "    <th>Equipamento</th>"
        tb += "    <th>Localização</th>"
        tb += "    <th>Agent SNMP</th>"
        tb += "    <th>IP</th>"
        tb += "    <th>Timeout</th>"
        tb += "    <th>Ações</th>"
        tb += "</thead>"
        tb += "    <tbody>"
        tb += "    </tbody>"
        tb += "</table>"
        tb += "</div>"
        $("#content").append(tb)
    } else {
        $("#content tbody").empty()
    }

    const result = await $request("get", null, { "page": "equipamentos" }); if (!result) { return }
    result.dados.map((element, index) => {
        if (element.name) {
            locationURL = $findURLInText(element.localizacao)
            tr = `<tr data-id=${element.ID}>`
            tr += `<td data-campo="equipamentoNome">${element.name}</td>`
            tr += `<td data-campo="equipamentoUrl">${locationURL.length > 0 ? '<a target="_blank" href="' + locationURL + '">' + element.localizacao.replace(/\[.*?\]/g, "") + '</a>' : element.localizacao}</td>`
            tr += `<td data-campo="equipamentoSNMP">${element.agentsnmp}</td>`
            tr += `<td data-campo="equipamentoIP">${element.ip}</td>`
            tr += `<td data-campo="equipamentoTimeout">${element.timeout}</td>`
            tr += `<td class="actions">
                <span class="add" title="Salvar"><i class="material-icons">&#xE03B;</i></span>
                <span class="edit" title="Editar"><i class="material-icons">&#xE254;</i></span>
                <span class="manage" title="Gerenciar"><i class="material-icons">&#xe2cc;</i></span>
                <span class="delete" title="Deletar"><i class="material-icons">&#xE872;</i></span>
            </td>`
            tr += `</tr>`
            $("#content tbody").append(tr)
        }
    })
}

$.loadPortasEquipamento = async function (equipamentoID) {
    const result = await $request("get", null, { "page": "equipamentos", "action": "viewPorts", "ID": equipamentoID }); if (!result) { return }
    if (result) {
        const equipamentoID = $("#modal_portas table").attr("data-id")
        if (equipamentoID) {
            $("#modal_portas tbody").empty()
            result.dados.map((element, index) => {
                if (element.destino) {
                    tr = `<tr data-id=${element.ID}>`
                    tr += `<td data-campo="portaDestino">${element.destino}</td>`
                    tr += `<td data-campo="portaInterface">${element.interface}</td>`
                    tr += `<td data-campo="portaRxOID">${element.RxOID}</td>`
                    tr += `<td data-campo="portaTxOID">${element.TxOID}</td>`
                    tr += `<td data-campo="portaAlcanceModulo">${element.alcance}</td>`
                    tr += `<td data-campo="portaOnda">${element.onda}</td>`
                    tr += `<td data-campo="portaOperacao">${element.operacao}</td>`
                    tr += `<td data-campo="portaRxPowerThreShold">${element.Rxthreshold}</td>`
                    tr += `<td data-campo="portaTxPowerThreShold">${element.Txthreshold}</td>`
                    tr += `<td class="actions">
                        <span class="add" title="Salvar"><i class="material-icons">&#xE03B;</i></span>
                        <span class="edit" title="Editar"><i class="material-icons">&#xE254;</i></span>
                        <span class="delete" title="Deletar"><i class="material-icons">&#xE872;</i></span>
                    </td>`
                    tr += `</tr>`
                    $("#modal_portas tbody").append(tr)
                }
            })
        }
        else {
            $alerts("Não existe ID atrelado ao elemento table", "error")
        }
    }
}

$request = function (type = "get", endpoint = null, data = {}) {
    try {
        return $.ajax(
            { url: `http://localhost/${endpoint ? "/".concat(endpoint) : ""}`, method: type, data: data, dataType: "json", }
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
    } catch (e) {
        $alerts(e, "crítico")
    }
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

$detectActions = function () {
    $(document).on("click", ".equipamentos tbody tr .actions .edit", function (e) {
        $(this).parents("tr").find("td:not(:last-child)").each(function () {
            $(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
        })
    })

    $(document).on("click", ".equipamentos tbody tr .actions .add", function (e) {
        newData = []
        $(this).parents("tr").find("td:not(:last-child)").each(function () {
            newData[$(this).data("campo")] = $(this).find("input").val()
        })
        // Faser requisição para atualizar
        $loadContentEquipamentos()
    })

    $(document).on("click", ".equipamentos tbody tr .actions .manage", async function (e) {
        equipamentoID = $(this).parents("tr").data("id")
        // exibir algum loading

        $("#modal_portas").modal("show")
        $("#modal_portas table").attr("data-id", equipamentoID)
        $.loadPortasEquipamento(equipamentoID)

        // fechar loading

    })

    $(document).on("click", ".equipamentos tbody tr .actions .delete", async function (e) {
        equipamentoID = $(this).parents("tr").data("id")

        $loadContentEquipamentos()
    })

    $(document).on("click", "#modal_portas tbody tr .actions .edit", function (e) {
        $(this).parents("tr").find("td:not(:last-child)").each(function () {
            $(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
        })
    })

    $(document).on("click", "#modal_portas tbody tr .actions .add", function (e) {
        newData = []
        $(this).parents("tr").find("td:not(:last-child)").each(function () {
            newData[$(this).data("campo")] = $(this).find("input").val()
        })
        console.log(newData)

        //Mandar para o back e atualizar o html

        $.loadPortasEquipamento($("#modal_portas table").attr("data-id"))
    })

    $(document).on("click", "#modal_portas tbody tr .actions .delete", async function (e) {
        equipamentoID = $(this).parents("tr").data("id")
        $.loadPortasEquipamento($("#modal_portas table").attr("data-id"))
    })

}