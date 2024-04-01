const state = {
    imgIdx: 0,
    annotations: {},
};

function ui(id) {
    return document.getElementById(id);
}
function nextImg() {
    state.imgIdx = Math.min(state.imgIdx + 1, ui('folder-upload').files.length);0    
    updateImg();
}
function previousImg() {
    state.imgIdx = Math.max(state.imgIdx - 1, 0);
    updateImg();
}
function updateImg() {
    if (ui('folder-upload').files.length === 0) {return;}
    
    imgFile = ui('folder-upload').files[state.imgIdx];    
    ui('image-view').src = URL.createObjectURL(imgFile);
    ui('image-file-name').textContent = imgFile.name;
    ui('classInput').value = state.annotations[imgFile.name] || '';
}
function downloadAnnotations() {    
    const json = JSON.stringify(state.annotations);
    const blob = new Blob([json], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'annotations.json';
    a.click();
}

function updateAutocomplete() {
    const availableTags = [
	"ActionScript",
	"AppleScript",
	"Asp",
	"BASIC",
	"C",
	"C++",
	"Clojure",
	"COBOL",
	"ColdFusion",
	"Erlang",
	"Fortran",
	"Groovy",
	"Haskell",
	"Java",
	"JavaScript",
	"Lisp",
	"Perl",
	"PHP",
	"Python",
	"Ruby",
	"Scala",
	"Scheme"
    ];
    const suggestions = [... new Set (Object.values(state.annotations))];
    suggestions.sort();
    
    $('#classInput').autocomplete({
	source: suggestions,
	delay: 0,
	open: function() {
            $('.ui-autocomplete').appendTo('#autocomplete');
	},
    });
}
function applyAnnotation() {
    if (ui('folder-upload').files.length === 0) {return;}
    
    const imgFile = ui('folder-upload').files[state.imgIdx];
    
    console.log('Hi')
    if (ui('classInput').value.trim() !== '') {
	state.annotations[imgFile.name] = ui('classInput').value || '';
    }
    
    updateAutocomplete();
    nextImg();
}
