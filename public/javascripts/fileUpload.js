const loadFile = event => {
    const images = document.querySelectorAll('.img-preview');
	images.forEach(image => image.src = URL.createObjectURL(event.target.files[0]));
};