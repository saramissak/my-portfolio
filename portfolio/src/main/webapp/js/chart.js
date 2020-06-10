google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

/** Fetches data and uses it to create a chart. */
async function drawChart() {
  fetch('/chart-data').then(response => response.json())
  .then((commentsSubmitted) => {
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Email');
    data.addColumn('number', 'Comments');
    Object.keys(commentsSubmitted).forEach((user) => {
      data.addRow([user, commentsSubmitted[user]]);
    });

    const options = {
      'title': 'Most Commented',
      'width':600,
      'height':500
    };

    const chart = new google.visualization.ColumnChart(
        document.getElementById('chart-container'));
    chart.draw(data, options);
  });
}

/** Fetches data and uses it to create a chart. */
async function newChart() {
  const params = new URLSearchParams();
  var email = document.getElementById('submitted-email');
  if (email != null) {
    params.append('email', email.value);
  } else {
    params.append('email', null);
  }
  const request = new Request('/chart-data', {method: 'POST', body: params});
  await fetch(request);
  fetch('/chart-data').then(response => response.json())
  .then((commentsSubmitted) => {
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Email');
    data.addColumn('number', 'Comments');
    Object.keys(commentsSubmitted).forEach((user) => {
      data.addRow([user, commentsSubmitted[user]]);
    });

    const options = {
      'title': 'Most Commented',
      'width':600,
      'height':500
    };

    const chart = new google.visualization.ColumnChart(
        document.getElementById('chart-container'));
    chart.draw(data, options);
  });
}
