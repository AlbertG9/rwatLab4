function displayData(data) {
    const tableBody = document.querySelector('#data-table tbody');
    tableBody.innerHTML = ''; 

    data.forEach(entry => {
        const row = document.createElement('tr');
        const firstName = document.createElement('td');
        const lastName = document.createElement('td');
        const id = document.createElement('td');

        const [nameFirst, nameLast] = entry.name.split(" ");
        firstName.textContent = nameFirst;
        lastName.textContent = nameLast;
        id.textContent = entry.id;

        row.appendChild(firstName);
        row.appendChild(lastName);
        row.appendChild(id);
        tableBody.appendChild(row);
    });
}

function fetchDataSync() {
    let data = [];
    const request = new XMLHttpRequest();

    request.open('GET', 'data/reference.json', false);
    request.send();
    const reference = JSON.parse(request.responseText);

    request.open('GET', `data/${reference.data_location}`, false);
    request.send();
    const data1 = JSON.parse(request.responseText);
    data = data.concat(data1.data);

    request.open('GET', `data/${data1.data_location}`, false);
    request.send();
    const data2 = JSON.parse(request.responseText);
    data = data.concat(data2.data);

    request.open('GET', 'data/data3.json', false);
    request.send();
    const data3 = JSON.parse(request.responseText);
    data = data.concat(data3.data);

    displayData(data);
}

function fetchDataAsync() {
    let data = [];
    const request = new XMLHttpRequest();
    
    request.open('GET', 'data/reference.json', true);
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            const reference = JSON.parse(request.responseText);

            const requestData1 = new XMLHttpRequest();
            requestData1.open('GET', `data/${reference.data_location}`, true);
            requestData1.onreadystatechange = function() {
                if (requestData1.readyState === 4 && requestData1.status === 200) {
                    const data1 = JSON.parse(requestData1.responseText);
                    data = data.concat(data1.data);

                    const requestData2 = new XMLHttpRequest();
                    requestData2.open('GET', `data/${data1.data_location}`, true);
                    requestData2.onreadystatechange = function() {
                        if (requestData2.readyState === 4 && requestData2.status === 200) {
                            const data2 = JSON.parse(requestData2.responseText);
                            data = data.concat(data2.data);

                            const requestData3 = new XMLHttpRequest();
                            requestData3.open('GET', 'data/data3.json', true);
                            requestData3.onreadystatechange = function() {
                                if (requestData3.readyState === 4 && requestData3.status === 200) {
                                    const data3 = JSON.parse(requestData3.responseText);
                                    data = data.concat(data3.data);
                                    displayData(data);
                                }
                            };
                            requestData3.send();
                        }
                    };
                    requestData2.send();
                }
            };
            requestData1.send();
        }
    };
    request.send();
}

function fetchDataWithFetch() {
    let data = [];

    fetch('data/reference.json')
        .then(response => response.json())
        .then(reference => {
            return fetch(`data/${reference.data_location}`);
        })
        .then(response => response.json())
        .then(data1 => {
            data = data.concat(data1.data);
            return fetch(`data/${data1.data_location}`);
        })
        .then(response => response.json())
        .then(data2 => {
            data = data.concat(data2.data);
            return fetch('data/data3.json');
        })
        .then(response => response.json())
        .then(data3 => {
            data = data.concat(data3.data);
            displayData(data);
        })
        .catch(error => console.error('Error:', error));
}
