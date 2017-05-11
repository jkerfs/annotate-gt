# annotate-gt

Simple client-side web application for producing ground-truth annotations for segmentation and detection tasks.  
Detection output json is compatible with (Tensorbox)[https://github.com/TensorBox/TensorBox].  

## 3rd Party Libraries
- [React](https://facebook.github.io/react/)
- [Literally Canvas](http://literallycanvas.com/)
- [JSZip](https://stuk.github.io/jszip/)

## Roadmap
- Add support for a labeling mode (specify the class of the photo)
- Produce zip of segmentation images (use JSZip)
- Fix restart where `setState` is called on an invalid Component
- Compile and use the latest LiterallyCanvas js files during build
