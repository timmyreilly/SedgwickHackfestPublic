function updateAll() {
  getDeductiblePayed();
  getClientBalance();
  getInsurerBalance();
  getTotalPaid();
  getMaxDeductible();
}

function updateProgressbar(id, loadingID, data) {
  $(id)
    .progressbar()
    .children(".ui-progressbar-value")
    .html("$" + data.lastPayment.client)
    .css({
      display: "block",
      width: getWidth(data.lastPayment.client, data.deductible.max) + "%"
    })
    .addClass("ms-font-m");
  $(id).show();
  $(loadingID).hide();
}

function updateProgressbar2(id, loadingID, amount, total) {
  $(id)
    .progressbar()
    .children(".ui-progressbar-value")
    .html("$" + amount)
    .css({
      display: "block",
      width: getWidth(amount, total) + "%"
    })
    .addClass("ms-font-m");
  $(id).show();
  $(loadingID).hide();
}

function getDeductiblePayed() {
  var jqXhr = $.ajax({
    url: "/data",
    method: "GET"
  });
  jqXhr
    .done(function(data) {
      updateProgressbar("#client-progressbar", "#client-loading", data);
    })
    .fail(function(err) {
      throw new Error(err);
    });
}

function paymentSubmit(amount) {
  var jqXhr = $.ajax({
    url: "/sedgwick/payment",
    method: "PUT",
    data: JSON.stringify({ value: amount }),
    contentType: "application/json"
  });
  jqXhr
    .done(function(res) {
      // if (res.client === 0) {
      //   $("#aa").show();
      //   $("#bb").show();
      //   $("#bb").css({ width: "100%" });
      //   updateProgressbar2(
      //     "#sw-progressbar-insurer",
      //     "#sw-loading-insurer",
      //     res.insurer,
      //     res.insurer + res.client
      //   );
      // } else if (res.insurer === 0) {
      //   $("#bb").hide();
      //   $("#aa").show();
      //   $("#aa").css({ width: "100%" });
      //   updateProgressbar2(
      //     "#sw-progressbar",
      //     "#sw-loading",
      //     res.client,
      //     res.insurer + res.client
      //   );
      // } else {
      $("#aa").show();
      $("#bb").show();
      $("#aa").css({ width: "45%" });
      $("#bb").css({ width: "45%" });
      updateProgressbar2(
        "#sw-progressbar",
        "#sw-loading",
        res.client,
        res.insurer + res.client
      );
      updateProgressbar2(
        "#sw-progressbar-insurer",
        "#sw-loading-insurer",
        res.insurer,
        res.insurer + res.client
      );
      // }
      updateAll();
    })
    .fail(function(err) {
      updateAll();
      throw new Error(err);
    });
}

function getClientBalance() {
  var jqXhr = $.ajax({
    url: "/data",
    method: "GET"
  });

  jqXhr.done(function(data) {
    $("#client-account-balance").html("$" + data.balances.client);
  });
}

function getMaxDeductible() {
  var jqXhr = $.ajax({
    url: "/data",
    method: "GET"
  });

  jqXhr.done(function(data) {
    $("#client-deductible-max").html("$" + data.deductible.max);
  });
}

function getInsurerBalance() {
  var jqXhr = $.ajax({
    url: "/data",
    method: "GET"
  });

  jqXhr.done(function(data) {
    $("#insurer-account-balance").html("$" + data.balances.insurer);
  });
}

function getTotalPaid() {
  var jqXhr = $.ajax({
    url: "/data",
    method: "GET"
  });

  jqXhr.done(function(data) {
    $("#client-total").html("$" + data.totalPTD);
    $("#sw-total").html("$" + data.totalPTD);
  });
}

function getWidth(amount, total) {
  var dec = amount / total;
  return Math.ceil(dec * 100);
}

function initProgressbar(id) {
  $(id)
    .progressbar()
    .children(".ui-progressbar-value")
    .html("$" + 0)
    .css({ display: "block", width: getWidth(0, 1) + "%" })
    .addClass("ms-font-m");
}

function addClientBalance(amount) {
  var jqXhr = $.ajax({
    url: "/client/balance",
    method: "PUT",
    data: JSON.stringify({ value: amount }),
    contentType: "application/json"
  });
  jqXhr
    .done(function(res) {
      updateAll();
    })
    .fail(function(err) {
      updateAll();
      throw new Error(err);
    });
}

function addInsurerBalance(amount) {
  var jqXhr = $.ajax({
    url: "/insurer/balance",
    method: "PUT",
    data: JSON.stringify({ value: amount }),
    contentType: "application/json"
  });
  jqXhr
    .done(function(res) {
      updateAll();
    })
    .fail(function(err) {
      updateAll();
      throw new Error(err);
    });
}

$(function() {
  // initProgressbar("#client-progressbar");
  // initProgressbar("#sw-progressbar");
  // initProgressbar("#sw-progressbar-insurer");
  $("#submitPayment").click(function() {
    var payment = parseInt($("#payment").val());
    if (payment !== NaN) {
      paymentSubmit(payment);
      $("#payment").val("");
    } else {
      console.log("payment is NaN");
    }
  });

  $("#submit-client-payment").click(function() {
    var payment = parseInt($("#client-payment").val());
    if (payment !== NaN) {
      addClientBalance(payment);
      $("#client-payment").val("");
    } else {
      console.log("payment is NaN");
    }
  });

  $("#submit-insurer-payment").click(function() {
    var payment = parseInt($("#insurer-payment").val());
    if (payment !== NaN) {
      addInsurerBalance(payment);
      $("#insurer-payment").val("");
    } else {
      console.log("payment is NaN");
    }
  });
});

$(window).load(function() {
  updateAll();
});
