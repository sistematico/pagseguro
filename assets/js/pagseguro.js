//Session ID
PagSeguroDirectPayment.setSessionId('<?php echo $session; ?>');
//console.log('<?php echo $session; ?>');

//Get SenderHash
$("#generateSenderHash").click(function () {
    PagSeguroDirectPayment.onSenderHashReady(function (response) {
        if (response.status == 'error') {
            console.log(response.message);
            return false;
        }
        //Hash estará disponível nesta variável.
        $("#senderHash").val(response.senderHash);
    });
})

//Get CreditCard Brand and check if is Internationl
$("#creditCardNumber").keyup(function () {
    if ($("#creditCardNumber").val().length >= 6) {
        PagSeguroDirectPayment.getBrand({
            cardBin: $("#creditCardNumber").val().substring(0, 6),
            success: function (response) {
                console.log(response);
                $("#creditCardBrand").val(response['brand']['name']);
                $("#creditCardCvv").attr('size', response['brand']['cvvSize']);
            },
            error: function (response) {
                console.log(response);
            }
        })
    };
})

function printError(error) {
    $.each(error['errors'], (function (key, value) {
        console.log("Foi retornado o código " + key + " com a mensagem: " + value);
    }));
}

function getPaymentMethods(valor) {
    PagSeguroDirectPayment.getPaymentMethods({
        amount: valor,
        success: function (response) {
            //console.log(JSON.stringify(response));
            console.log(response);
        },
        error: function (response) {
            console.log(JSON.stringify(response));
        }
    })
}

//Generates the creditCardToken
$("#generateCreditCardToken").click(function () {
    var param = {
        cardNumber: $("#creditCardNumber").val(),
        cvv: $("#creditCardCvv").val(),
        expirationMonth: $("#creditCardExpMonth").val(),
        expirationYear: $("#creditCardExpYear").val(),
        success: function (response) {
            console.log(response);
            $("#creditCardToken").val(response['card']['token']);
        },
        error: function (response) {
            console.log(response);
            printError(response);
        }
    }
    //parâmetro opcional para qualquer chamada
    if ($("#creditCardBrand").val() != '') {
        param.brand = $("#creditCardBrand").val();
    }
    PagSeguroDirectPayment.createCardToken(param);
})

//Check installment
$("#installmentCheck").click(function () {
    if ($("#creditCardBrand").val() != '') {
        getInstallments();
    } else {
        alert("Uma bandeira deve estar selecionada");
    }
})

function getInstallments() {
    var brand = $("#creditCardBrand").val();
    PagSeguroDirectPayment.getInstallments({
        amount: $("#checkoutValue").val().replace(",", "."),
        brand: brand,
        maxInstallmentNoInterest: 2, //calculo de parcelas sem juros
        success: function (response) {
            var installments = response['installments'][brand];
            buildInstallmentSelect(installments);
        },
        error: function (response) {
            console.log(response);
        }
    })
}

function buildInstallmentSelect(installments) {
    $.each(installments, (function (key, value) {
        $("#InstallmentCombo").append("<option value = " + value['quantity'] + ">" + value['quantity'] + "x de " + value['installmentAmount'].toFixed(2) + " - Total de " + value['totalAmount'].toFixed(2) + "</option>");
    }))
}
