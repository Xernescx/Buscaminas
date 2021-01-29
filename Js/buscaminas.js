let board = document.getElementById("tablero");
let test = false; 
let minas = 10;
let rows=10, column=10;
generarBoard();

function generarBoard() {
  //Genera el tablero con lo que le pongamos en la i y en la j
  board.innerHTML="";
  for (let i=0; i<rows; i++) {
    row = board.insertRow(i);
    for (let j=0; j<column; j++) {
      cell = row.insertCell(j);
      cell.onclick = function() { testCell(this); };
      let bomba = document.createAttribute("data-mine");       
      bomba.value = "false";             
      cell.setAttributeNode(bomba);
    }
  }
  addMinas();
}

//Funcion que agrega las bombas en celdas no repetidas
function addMinas() {
  for (let i=0; i<minas; i++) {
    let row = Math.floor(Math.random() * rows);
    let col = Math.floor(Math.random() * column);
    let cell = board.rows[row].cells[col];
    //Si ya hay una bomba en esa celda, dismuimos el indice del bucle para que busque una nueva celda sin bomba
    if ( cell.getAttribute("data-mine")=="true") i--;
      else cell.setAttribute("data-mine","true");
    
  }
}

function showMinas() {
    //Colorea todas las minas a color rojo cuando llamamos a este método, cuando ganamos o perdemos
    for (let i=0; i<rows; i++) {
      for(let j=0; j<column; j++) {
        let cell = board.rows[i].cells[j];
        if (cell.getAttribute("data-mine")=="true") cell.className="mine";
      }
    }
}

function testCell(cell) {
  //Comprueba si la persona ha clickado en una mina 
  if (cell.getAttribute("data-mine")=="true") {
    showMinas();
    alert("Has clickado en una mina");

  } else {
    cell.className="clicked";
    
    let contadorMinas=0; //Usamos esta variable para que enseñe el numero de minas que hay alrededor de cada 1
    let celdasFilas = cell.parentNode.rowIndex;
    let celdasColumnas = cell.cellIndex;
      //Cuenta y enseña el numero de minas que hay alrededor
    for (let i=Math.max(celdasFilas-1,0); i<=Math.min(celdasFilas+1,(rows -1)); i++) {
      for(let j=Math.max(celdasColumnas-1,0); j<=Math.min(celdasColumnas+1,(column -1)); j++) {
        if (board.rows[i].cells[j].getAttribute("data-mine")=="true") contadorMinas++;
      }
    }

    //Esta linea igual la celda clickada al contador de minas
    cell.innerHTML=contadorMinas;

    if (contadorMinas==0) { 
   //Revela todas las celdas adyacentes que no tengan una mina
      for (let i=Math.max(celdasFilas-1,0); i<=Math.min(celdasFilas+1,(rows -1)); i++) {
        for(let j=Math.max(celdasColumnas-1,0); j<=Math.min(celdasColumnas+1, (column -1)); j++) {
         //Usamos esta linea recursiva para contar los 0s que hay alrededor
          if (board.rows[i].cells[j].innerHTML=="") testCell(board.rows[i].cells[j]);
        }
      }
    }
    check();
  }
}

function check() {
  //Creamos una variable booleana para comprobar 
  var nivelCompletado = true;
    for (let i=0; i<10; i++) {
      for(let j=0; j<10; j++) {
        if ((board.rows[i].cells[j].getAttribute("data-mine")=="false") && (board.rows[i].cells[j].innerHTML=="")) nivelCompletado=false;
      }
  }
  if (nivelCompletado) {
    alert("Has ganado!");
    showMinas();

  }  
}

function sizeboard(){
  let radioBtnEasy = document.getElementById('easy');
  let radioBtnNormal = document.getElementById('normal');
  let radioBtnHard = document.getElementById('hard');
  let errorNumbersText = document.getElementById("errorNumbersText");
  let max=20;//Limito un maximo de filas y columnas arbitrario
  let ok=false;
  
  if( radioBtnEasy.checked ){
      rows=10;
      column=10;
      minas=10;
      ok=true;
  } else if ( radioBtnNormal.checked ){
      rows=15;
      column=15;
      minas = 20;
      ok=true;
  } else if ( radioBtnHard.checked ){
    rows=20;
    column=20;
    minas = 30;
      ok=true;
  } else {
    rows = document.getElementById("numRow").value;
    column = document.getElementById("numColumn").value;
    minas = ((rows * column)/2)/2;
      let evenNumberRow = (parseInt ( rows )/2).toString().indexOf('.')==-1;
      let evenNumberColumn = (parseInt ( column )/2).toString().indexOf('.')==-1;

      if( rows>0 && column>0 && evenNumberRow && evenNumberColumn ){
          if( rows>max){
              rows=max;
              errorNumbersText.innerHTML="Máximo de filas "+max+"<br>";
          }

          if( column>max){
            column=max;
              errorNumbersText.innerHTML+="Máximo de columnas "+max;
          }
          ok=true;
      } else {
          errorNumbersText.innerHTML="Valores no válidos";
      }
  }

  if(ok) generarBoard();
}