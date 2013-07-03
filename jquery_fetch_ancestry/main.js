$(function(){
    $('#eol_page_id').select();
    $('#only_form').submit(function() {
        var eol_page_id = $('#eol_page_id').val();
        $('#eol_page_id').select();
        lookup_eol_page(eol_page_id);
        return false;
    });
});

function lookup_eol_page(eol_page_id) {
    $.ajax({
        url: 'http://eol.org/api/pages/' + eol_page_id + '.json?cache_ttl=604800&callback=?',
        dataType: 'jsonp',
        jsonpCallback: 'lookup_eol_page_callback',
        cache: true }
    );
}

function lookup_eol_page_callback(json) {
    if(json.taxonConcepts[0] === undefined) alert("Invalid Page ID");
    else {
        var number_of_taxon_concepts = json.taxonConcepts.length;
        var found_a_match = false;
        for(var i=0 ; i<number_of_taxon_concepts ; i++) {
            if(json.taxonConcepts[i].nameAccordingTo == 'Species 2000 & ITIS Catalogue of Life: April 2013') {
                lookup_hierarchy_entry(json.taxonConcepts[i].identifier);
                found_a_match = true;
            }
        }
        if(found_a_match == false) alert("This page does not have a Catalogue of Life hierarchy");
    }
}

function lookup_hierarchy_entry(hierarchy_entry_id) {
    $.ajax({
        url: 'http://eol.org/api/hierarchy_entries/' + hierarchy_entry_id + '.json?cache_ttl=604800&callback=?',
        dataType: 'jsonp',
        jsonpCallback: 'lookup_hierarchy_entry_callback',
        cache: true }
    );
}

function lookup_hierarchy_entry_callback(json) {
    if(json.sourceIdentifier === undefined) alert("Invalid Hierachy Entry ID");
    else {
        var ancestor_names = []
        var number_of_ancestors = json.ancestors.length;
        for(var i=0 ; i<number_of_ancestors ; i++) {
            ancestor_names[i] = json.ancestors[i].scientificName;
        }
        alert(ancestor_names);
    }
}
