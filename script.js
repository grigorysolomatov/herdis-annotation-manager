const state = {
    imgIdx: 0,
    annotations: {},
    files: [],
};

function ui(id) {
    return document.getElementById(id);
}
function nextImg() {
    state.imgIdx = Math.min(state.imgIdx + 1, state.files.length);
    updateImg();
}
function previousImg() {
    state.imgIdx = Math.max(state.imgIdx - 1, 0);
    updateImg();
}
function updateImg() {
    if (state.files.length === 0) {return;}
    
    const imgFile = state.files[state.imgIdx];
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
    a.download = (state.files.length == 0) ? 'annotations.json'
	: state.files[0].name.split('_').splice(0, 2).join('_') + '.json';
    a.click();
}
function updateAutocomplete() {    
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
    if (state.files.length === 0) {return;}
    
    const imgFile = state.files[state.imgIdx];
    
    if (ui('classInput').value.trim() !== '') {
	state.annotations[imgFile.name] = ui('classInput').value || '';
    }
    
    updateAutocomplete();
    nextImg();
}
function init() {
    window.addEventListener('keydown', function(e) {
	switch(e.key) {
	case 'ArrowLeft':
            e.preventDefault();
            previousImg();
            break;
	case 'ArrowRight':
            e.preventDefault();
            nextImg();
            break;
	}
    });
}
function uploadFolder() {
    state.files = Array.from(ui('folder-upload').files).sort(
	(file1, file2) => file2.size - file1.size
    );
    updateImg();
}

init();
