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
      title: 'Number of comments per user',
      width: '150%',
      height: 500,
      hAxis: {
          title: 'User Email',
      },
      colors: ['teal']
    };

    const chart = new google.visualization.ColumnChart(document.getElementById('chart-container'));
    chart.draw(data, options);
  });
}

/** Fetches data and uses it to create a chart. Using POST method. */
// Parameter is to check if a comment had been deleted or not. False for is nothing has been deleted, true if something has been.
async function newChart(deleted) {
  const params = new URLSearchParams();
  var email = document.getElementById('submitted-email');
  if (email != null) {
    params.append('email', email.value);
  } else {
    params.append('email', null);
  }
  params.append('deleted', deleted)
  const request = new Request('/chart-data', {method: 'POST', body: params});
  await fetch(request);
  drawChart();
}