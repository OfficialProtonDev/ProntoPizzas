function addRow() {
    var container = document.getElementById('pizza-rows');
    var rows = container.querySelectorAll('.order-row');
    if (rows.length === 0) return;

    var lastRow = rows[rows.length - 1];
    var newRow = lastRow.cloneNode(true);

    // Clear values in the cloned row
    newRow.querySelectorAll('select, input').forEach(function (el) {
        if (el.tagName === 'SELECT') el.selectedIndex = 0;
        if (el.tagName === 'INPUT') el.value = '';
    });

    container.appendChild(newRow);
    updateIndexes();
}

function removeRow(btn) {
    var row = btn.closest('.order-row');
    var container = document.getElementById('pizza-rows');
    if (container.querySelectorAll('.order-row').length > 1) {
        container.removeChild(row);
        updateIndexes();
    }
}

function updateIndexes() {
    var container = document.getElementById('pizza-rows');
    var rows = container.querySelectorAll('.order-row');
    rows.forEach(function (row, i) {
        row.querySelectorAll('select, input, span').forEach(function (el) {
            var name = el.getAttribute('name');
            var id = el.getAttribute('id');
            if (name) {
                el.setAttribute('name', name.replace(/\d+/, i));
            }
            if (id) {
                el.setAttribute('id', id.replace(/\d+/, i));
            }
        });
    });
}