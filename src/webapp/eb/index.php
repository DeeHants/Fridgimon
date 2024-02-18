<html>
    <head>
        <title>Fridgimon scanner</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <META HTTP-Equiv="ButtonBar1" content="visibility:visible">
        <script type="text/javascript" charset="utf-8" src="ebapi-modules.js"></script>
        <script type="text/javascript" charset="utf-8" src="elements.js"></script>
        <script type="text/javascript">
            // Document handling
            window.addEventListener('DOMContentLoaded', loadEvent);
            window.addEventListener('unload',unloadEvent);

            function loadEvent(){
                initScanner();
            }

            function unloadEvent(){
                 uninitScanner();
            }

            // Button bar handling
            document.addItem = function() {
                alert("adding");
            }

            document.checkItem = function() {
                alert("checking");
            }

            document.listItems = function() {
                alert("listing");
            }

            document.removeItem = function() {
                alert("removing");
            }

            // Scanner handling
            function initScanner(){
                EB.Barcode.enable({
                    allDecoders: true,
                }, scanReceived);
            }

            function uninitScanner(){
                 EB.Barcode.disable();
            }

            function scanReceived(params){
                if(params['data'] == ""){
                    document.getElementById('display').innerHTML = "<span style=\"color:red;\">Scan failed</span>";
                    return;
                }

                var scan_upc = params['data'];
                var scan_source = params['source'];
                var scan_type = params['type'];

                EB.jQuery.ajax({
                    url: "/api/lookup?code=" + params['data'],
                    async: true,
                    dataType: 'json',
                    success: function(data, status, jqXHR) {
                        var lookup_upc = data['upc'];
                        if (!data['found']) {
                            document.getElementById('display').innerHTML = "<span style=\"color:red;\">No result for " + lookup_upc + "</span>";
                        } else {
                            var lookup_name = data['name'];
                            document.getElementById("display").innerHTML = lookup_name;
                        }
                    },
                    error: function(jqXHR, errorText, errorThrown) {
                        document.getElementById('display').innerHTML = "<span style=\"color:red;\">Unabel to lookup " + scan_upc + "</span>";
                    },
                });
            }
        </script>
    </head>

    <body>
        <br/><br/>
        <h1>Fridgimon</h1>
        <div id="display"></div>
    </body>
</html>
