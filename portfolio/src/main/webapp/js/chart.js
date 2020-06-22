google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

var pageNum = 0;
/** Fetches data and uses it to create a chart. */
async function drawChart(request = (new Request('/data', {method: 'POST'}))) {
  await fetch(request).then(response => response.json()).then((serverData) => {
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Email');
    data.addColumn('number', 'Comments');
    Object.keys(serverData.accountIdToCommentCountMap).forEach((user) => {
      data.addRow([user, serverData.accountIdToCommentCountMap[user]]);
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

    if (pageNum <= 0) {
      document.getElementById('previous-button-top').disabled = true;
      document.getElementById('previous-button-bottom').disabled = true
    } else {
      document.getElementById('previous-button-top').disabled = false;
      document.getElementById('previous-button-bottom').disabled = false;    
    }

	console.log(serverData.totalNumOfComments);
    if (serverData.totalNumOfComments <= (pageNum+1)*document.getElementById('num-results').value) {
      document.getElementById('next-button-top').disabled = true;
      document.getElementById('next-button-bottom').disabled = true;
    } else {
      document.getElementById('next-button-top').disabled = false;
      document.getElementById('next-button-bottom').disabled = false;
    }
  });
}

/** Fetches data and uses it to create a chart. Using POST method. */
// Parameter is to check if a comment had been deleted or not. False for is nothing has been deleted, true if something has been.
async function newChart(deleted, pageNum, params) {
  pageNum = pageNum;
  var request = new Request('/delete-comment', {method: 'POST', body: params});
  if (deleted.localeCompare("null") == 0) { //delete all comments
	request = new Request('/delete-data', {method: 'POST'});
  } else if (deleted.localeCompare("false") == 0) { //something has not been deleted
    params.append('num-results', document.getElementById('num-results').value);
    params.append('page', pageNum);
    request = new Request('/data', {method: 'POST', body: params});
  } 
  await drawChart(request);
}