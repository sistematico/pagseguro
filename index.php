<?php

require __DIR__ . '/vendor/autoload.php';

$config = parse_ini_file(".env");

$credenciais = [
  "email" => $config['email'],
  "token" => $config['token']
];

$url_pagseguro = "https://ws.sandbox.pagseguro.uol.com.br/v2/sessions";

$curl = curl_init($url_pagseguro);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($credenciais));
$resultado = curl_exec($curl);
curl_close($curl);
$session = simplexml_load_string($resultado)->id;

?>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PagSeguro PHP</title>
  <link rel="stylesheet" href="assets/css/main.css">
</head>
<body>
  <main>
    <header><img src="https://i.imgur.com/Kbn1bYe.png"></header>
    <nav>
      <ul>
        <li><a href="index.php">Compra</a></li>
        <li><a href="assinatura.php">Assinatura</a></li>
      </ul>
    </nav>
    <article>
    <div class="contain">
      <div class="wrapper">
        <div class="contacts">
          <h3>Sessão</h3>
          <ul>
            <li><?=$session?></li>
          </ul>
        </div>
        <div class="form">
          <h3>Comprar Plano 1</h3>
          <form action="">
            <p>
              <label for="">Seu nome</label>
              <input type="text" value="João Comprador">
            </p>
            <p>
              <label for="">E-mail</label>
              <input type="email" value="c54962368416735731500@sandbox.pagseguro.com.br">
            </p>
            <p>
              <label for="">Valor</label>
              <input type="text" value="10">
            </p>
            <p>
              <button class="btn btn--stripe">Comprar</button>
            </p>
          </form>
        </div>
      </div>
    </div>
    </article>
    <footer>
      <ul>
        <li>Copyleft 2021 - Lucas Salies Brum</li>
      </ul>
    </footer>
  </main>

<script src="https://stc.sandbox.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="assets/js/pagseguro.js"></script>
</body>
</html>