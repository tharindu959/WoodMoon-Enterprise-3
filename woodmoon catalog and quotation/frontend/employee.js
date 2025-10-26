$(document).ready(function() {
    // Handle user form submission
    $("#quotationForm").submit(function(e) {
        e.preventDefault(); // Prevent default form submission

        const name = $("#nameInput").val();
        const phone = $("#phoneInput").val();
        const details = $("#detailsInput").val();

        const data = {
            name: name,
            phone: phone,
            quotationDetails: details
        };

        $.ajax({
            url: "http://localhost:8080/api/quotations",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(response) {
                alert("Quotation sent successfully!");
                $("#quotationForm")[0].reset();
            },
            error: function(xhr, status, error) {
                alert("Error sending quotation. Check console for details.");
                console.error(xhr.responseText);
            }
        });
    });

    // Toggle interface
    const toggle = $("#toggleInterface");
    const toggleLabel = $("#toggleLabel");
    const userForm = $("#quotationForm").parent(); // container
    const adminInterface = $("#adminInterface");

    toggle.change(function() {
        if ($(this).is(":checked")) {
            userForm.hide();
            adminInterface.show();
            toggleLabel.text("Admin Interface");
            fetchQuotations();
        } else {
            userForm.show();
            adminInterface.hide();
            toggleLabel.text("User Interface");
        }
    });

    // Fetch quotations from backend
    function fetchQuotations() {
        $.ajax({
            url: "http://localhost:8080/api/quotations", // GET endpoint
            type: "GET",
            success: function(response) {
                const tableBody = $("#adminTableBody");
                tableBody.empty(); // clear previous data
                response.forEach(function(quote, index) {
                    tableBody.append(`
                        <tr>
                            <td>${index + 1}</td>
                            <td>${quote.name}</td>
                            <td>${quote.phone}</td>
                            <td>${quote.quotationDetails}</td>
                        </tr>
                    `);
                });
            },
            error: function(xhr, status, error) {
                alert("Error fetching quotations. Check console for details.");
                console.error(xhr.responseText);
            }
        });
    }
});

