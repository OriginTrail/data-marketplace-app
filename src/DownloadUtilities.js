export default {
    saveJson(obj, name) {
        var str = JSON.stringify(obj);
        var data = this.encode( str );

        let filename = name + '.json';

        var blob = new Blob( [ data ], {
            type: 'application/octet-stream'
        });

        var url = URL.createObjectURL( blob );
        var link = document.createElement( 'a' );
        link.setAttribute( 'href', url );
        link.setAttribute( 'download', filename);
        var event = document.createEvent( 'MouseEvents' );
        event.initMouseEvent( 'click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        link.dispatchEvent( event );
    },
    encode( s ) {
        var out = [];
        for ( var i = 0; i < s.length; i++ ) {
            out[i] = s.charCodeAt(i);
        }
        return new Uint8Array( out );
    },
}
