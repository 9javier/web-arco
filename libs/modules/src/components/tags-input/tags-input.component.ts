import { Component, OnInit, Input, forwardRef, ViewChild, ElementRef,ViewChildren, QueryList, Query,Renderer2, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR  } from '@angular/forms';
import { TagsInputOption } from './models/tags-input-option.model';

@Component({
  selector: 'suite-tags-input',
  templateUrl: './tags-input.component.html',
  styleUrls: ['./tags-input.component.scss'],
  providers:[{
        provide: NG_VALUE_ACCESSOR, 
        useExisting: forwardRef(() => TagsInputComponent),
        multi: true 
  }]
})
export class TagsInputComponent implements OnInit,ControlValueAccessor {

  @Input() literal:boolean = false;

  @Input() set options(options){
    if(options.length){
      console.log(options, "teststs");
      this._options =options.map(option=>{
        if(!this.literal){
          option.id = parseInt(option.id);
          option.type = "number";
        }else{
          option.id = option.name;
          option.type = "string";
        }
        return option;
      });
      if(this.multiple)
        this.writeValue(this.values);
      else
        this.writeValue(this.value);
      this.filteredOptions = this.filterOptions(options,"");
    }
  }

  flagEmmit = false;
  values:Array<any> = [];
  prevLength;
  activeClass: boolean = false;

  lastNode;

  /**The placeholder to be showed */
  @Input() placeholder = "";

  /**If this is true return an array */
  @Input() multiple:boolean;

  /**If this inside an acordeon element */
  @Input() notShow:boolean;

  /**Options to be selected*/
  _options:Array<TagsInputOption> = [];

  /**Options DOM elements to scroll */
  @ViewChildren("optionList") optionsElements:QueryList<ElementRef>;

  /**Option pointer index, using for select the option with the keyboard*/
  optionPointerIndex:number = 0;

  /**Selected option */
  selectedOption:TagsInputOption;

  /**The current typed text transformed into option */
  currentTextOption:TagsInputOption;

  /**Filtered options to be showeds */
  filteredOptions:Array<TagsInputOption> = [];

  selectedsOptions:Array<TagsInputOption> = [];

  ids:Array<any> = []; 


  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(!this.eRef.nativeElement.contains(event.target)) {
      this.activeClass = false;
    }
  }

  filterOptions(options:Array<TagsInputOption>,text:string):Array<TagsInputOption>{    
    return options.filter(option=>option.name.toLowerCase().includes(text.trim().toLowerCase()));
  }


 /**
  * Insert node after another
  * @param newNode - the new node to be inserted
  * @param referenceNode - the reference node
  */
  insertAfter(newNode:Node, referenceNode:Node) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  /**
   * emit the tags with the id for the control
   */
  emitSelection():Array<any>{
    let tags =[];
    this.inputElement.nativeElement.childNodes.forEach(node => {
      if(node.dataset && node.dataset.id)
        tags.push((node.dataset.type=="number")?parseInt(node.dataset.id):node.dataset.id.toString());
    });
    if(this.multiple)
      this.onChange(tags)
    else
      this.onChange(tags.length?tags[0]:null);
    return [];
  }


  /**
   * Select option via input options
   * @param option - the selected option
   */
  selectOption(option:TagsInputOption,click?):void{
    ////console.log(option.name,"hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
    this.filteredOptions = [];
    //this.selectedOption = option;
    this.optionPointerIndex = 0;
    /**Obtenemos el nodo que se está editando actualmente */
    let node;
    if(!click)
      node = window.getSelection().anchorNode;
    else
      node = this.lastNode;
    this.flagEmmit = true;
    this.insertTag(option.id,(node!=this.inputElement.nativeElement)?node:null);
    if(this.notShow) {
      this.activeClass = !this.activeClass;
    }
  }

  /**
   * @todo definition
   * @param event 
   */
  clickEditable(event):void{
    if(this.notShow) {
      this.activeClass = !this.activeClass;
    }
    let target = event.target;
    let node = window.getSelection().anchorNode;
    this.filteredOptions = this.filterOptions(this._options,node.textContent);
    //console.log(window.getSelection());
  }

  /**
   * test purpouses
   * @param event 
   */
  eventClick(event){
    ////console.log(event);
  }

  /**
   * empty the current selected option
   */
  emptyOption():void{
    this.filteredOptions = this.filterOptions(this._options,"");
    this._value = '';
    if(!this.multiple)
      this.onChange("");
    else
      this.onChange([]);
    this.onTouch();
  }

  intervalEmit;
  onKeyPress(event){
    let node:any = window.getSelection().anchorNode;
    if(node.parentElement.className != "parent-editable" )
      node = node.parentElement;
    let key = event.key;
    if(key == 'Enter'){
      return false;
    }else if(key == "Backspace"){
      if(node.className == "input-tag"){
        this.inputElement.nativeElement.removeChild(node);
        clearTimeout(this.intervalEmit)
        this.intervalEmit = setTimeout(()=>{
          this.emitSelection();       
        },100);
      }
    }else if(key == "Escape"){
      this.inputElement.nativeElement.blur();
      this.inputElement.nativeElement.removeChild(node);
      clearTimeout(this.intervalEmit)
      this.intervalEmit = setTimeout(()=>{
        this.emitSelection();       
      },100);
    }
  }

  /**
   * Using for select the option with the keyboard
   * @param event -the keypress event
   */
  onKeyUp(event){
    let key = event.key;
    if(key == 'Enter'){
      this.selectOption(this.filteredOptions[this.optionPointerIndex]);
    }
    if(key == 'ArrowUp'){
      this.optionPointerIndex = this.optionPointerIndex - 1;
      if(this.optionPointerIndex < 0)
        this.optionPointerIndex = this.filterOptions.length;
    }if(key == 'ArrowDown')
      this.optionPointerIndex = Math.abs(this.optionPointerIndex+1)%this.filteredOptions.length;
    this.scrollElement(this.optionsElements,this.optionPointerIndex);
  }


  /**The updated value of component */
  private _value = '';

  /**Know if the element is disabled */
  disabled:boolean;

  @ViewChild('input') inputElement:ElementRef;

  /**Programatically set the control value */
  @Input() set value(value){
    this._value = value;
    this.onChange(value);
    this.onTouch();

  }

  /**Programatically get the control value */
  get value():string{
    return this._value;
  }

  constructor(private renderer:Renderer2, private eRef: ElementRef) { }

  ngOnInit() {
  }

  /**
   * return a workd given by index
   * @param str - string to search into
   * @param index - index of letter of word
   * @returns the word at the selected index
   */
  getWord(str:string,index:number):string{
    /**divide the text of div in words */
    let positions:Array<string> = str.split(" ");
    let separator = " ";
    let startPosition = null;
    let endPosition = null;
    for(let i = 0; i < str.length; i++){
      let comparator = str.substr(i,separator.length);
      //console.log("comparator",comparator,separator, comparator == separator);
      if(comparator == separator)
        if(startPosition === null)
          startPosition = i+separator.length;
        else
          endPosition = i;
      if(startPosition<index){
        //console.log(startPosition,index)
        startPosition=null;
        endPosition =null;
      }
    }
    startPosition=startPosition!==null?startPosition:0;
    endPosition = endPosition!==null?endPosition:str.length;
    //console.log('separador',startPosition,endPosition);
    return str.substr(startPosition,endPosition-startPosition);
  }

  replaceWord(str:string,index:number,replacement:string):string{
        /**divide the text of div in words */
        let positions:Array<string> = str.split(" ");
        let separator = " ";
        let startPosition = null;
        let endPosition = null;
        for(let i = 0; i < str.length; i++){
          let comparator = str.substr(i,separator.length);
          //console.log("comparator",comparator,separator, comparator == separator);
          if(comparator == separator)
            if(startPosition === null)
              startPosition = i+separator.length;
            else
              endPosition = i;
          if(startPosition<index){
            //console.log(startPosition,index)
            startPosition=null;
            endPosition =null;
          }
        }
        startPosition=startPosition!==null?startPosition:0;
        endPosition = endPosition!==null?endPosition:str.length;
        //console.log('separador',startPosition,endPosition);
    return str.substr(0,startPosition)+replacement+str.substr(endPosition);
  }

  /**
   * Cause we have inner nodes and getSelection return the selection of most inner element we need add the length of all other elements
   * @param parentElement - the parent element to extract the length
   * @param currentNode - for stop the loop
   * @returns the offset
   */
  getOffsetPosition(parentElement:ElementRef,currentNode):number{
    let offset:number = 0;
    for(let i = 0; i < parentElement.nativeElement.childNodes.length || 0; i++){
      let _node = parentElement.nativeElement.childNodes[i];
      if(_node === currentNode ){
       break;
      }else{
        //console.log(_node);
        offset+=(_node.innerText || _node.textContent).length;
      }
       
    }
    return offset-1;
  }

  /**
   * Function that be triggered when user input a text
   * @summary this function is not an angular way for dataBinding
   */
  onInput(event):void{
    
    /**nodo sobre el cual se está escribiendo*/
    let node = window.getSelection().anchorNode;
    this.lastNode = node;
    console.log("que pasa",this._options,node.textContent);
    /**y eso es lo que vamos a usar para filtrar */
    this.filteredOptions = this.filterOptions([...this._options],node.textContent.trim());
    console.warn(this.filteredOptions);
    if(node.textContent && !this._options.filter(option=>option.name.toLowerCase()==(node.textContent.trim()).toLowerCase())[0]){
      this.currentTextOption = {
        id:node.textContent,
        name:node.textContent,
        type:"text"
      }
      this.filteredOptions = [this.currentTextOption].concat(this.filteredOptions);
    }

    console.log("longitud",this.inputElement.nativeElement.childNodes.length);
    ////console.log("testes")
    /**Get the text of the div */
    /*let text:string = this.inputElement.nativeElement.innerText;
    let selection = window.getSelection();
    let cursorPosition:number = window.getSelection().focusOffset - 1;
    cursorPosition+=this.getOffsetPosition(this.inputElement,selection.anchorNode);
    //console.log(text,cursorPosition);
    let textToFilter = this.getWord(text,cursorPosition);
    //console.log(text.length,textToFilter);
    this.filteredOptions = this.filterOptions(this._options,textToFilter);*/

    /**if not have exactyle coincidence add the current text as option */
    /*if(textToFilter && !this._options.find(option=>option.name.toLowerCase()==textToFilter.toLowerCase())){
      this.currentTextOption = {
        id:textToFilter,
        name:textToFilter
      }
      this.filteredOptions = [this.currentTextOption].concat(this.filteredOptions);
    }*/
    //this.onChange(text);
  }

  /**
   * Cause we have inner nodes and getSelection return the selection of most inner element we need add the length of all other elements
   * @param parentElement - the parent element to extract the length
   * @param currentNode - for stop the loop
   * @returns the offset
   */
 getIndexOfNode(parentElement:ElementRef,currentNode):number{
   //console.log(currentNode);
    for(let i = 0; i < parentElement.nativeElement.childNodes.length || 0; i++){
      let _node = parentElement.nativeElement.childNodes[i];
      if(_node === currentNode )
       return i;
    }
    return ;
 }

  /**
   * Change a word for a tag
   * @param option - option to set
   */
  setTag(option:TagsInputOption,str:string,index:number):string{

      let text:string = this.inputElement.nativeElement.innerText;
      let selection = window.getSelection();
      let cursorPosition:number = window.getSelection().focusOffset - 1;
      cursorPosition+=this.getOffsetPosition(this.inputElement,selection.anchorNode);
      //console.log(text,cursorPosition);
      let textToFilter = this.replaceWord(text,cursorPosition,`<span class="tag" style="
      background: #222428;
      color: white;
      white-space: pre;
      padding: 2px 4px;
      border-radius: 5px;
      white-space:pre">${option.name}</span> <span></span>`);
      //console.log(textToFilter);
    
        //let offset:number = this.getIndexOfNode(this.inputElement,window.getSelection().anchorNode);
        /**divide the text of div in words */
        //let positions:Array<string> = str.split(" ");
        /**Index of the last position of last iterate word on string */
        //let lastIndex:number = 0;
        /**Search the current typing workd */
       /* let i:number = 0;
        for(i ;i<positions.length; i++){
          let position:string = positions[i];
          if(index>=lastIndex && index<=(lastIndex+position.length))
            break;
          lastIndex+=position.length;
        }
        this.ids[i] = option.id;
        positions[i] = `<span class="tag" style="
          background: #222428;
          color: white;
          white-space: pre;
          padding: 2px 4px;
          border-radius: 5px;
          white-space:pre">${option.name}</span> <span></span>`;
        this.inputElement.nativeElement.innerHTML = positions.join(" ");
        this.inputElement.nativeElement.focus();
        let startNode = offset?this.inputElement.nativeElement.childNodes[offset]:this.inputElement.nativeElement;
        //console.log(startNode,offset);
        let endNode = startNode;*/
        setTimeout(()=>{
         /* let range = document.createRange();
          range.setStart(startNode, 0); // 6 is the offset of "world" within "Hello world"
          range.setEnd(endNode, 0); // 7 is the length of "this is"
          let sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);*/
        },0);

        //////console.log(this.inputElement.nativeElement);
        //this.inputElement.nativeElement.setSelectionRange(index,index);
        this.inputElement.nativeElement.innerHTML = textToFilter;
        return textToFilter;
  }



  /**
   * Scroll option elements with the keyboards
   * @param options - the list of elements options to scroll
   * @param index - the index of element to be scroll
   */
  scrollElement(options:QueryList<ElementRef>,index:number):boolean{
    if(!options.length)
      return false;
    let element = options.toArray()[index].nativeElement;
    let container = element.parentNode;
    container.scrollTop = element.offsetTop;
    return true;
  }


  onChange(value){}

  onTouch(){}

  /**
   * 
   * @param id - the id to be inserted
   * @param node - the node to be replaced
   * @returns the last node inserted
   */
  insertTag(id:any,node?:Node,emit=true):Node{
    let option = this._options.filter(option=>option.id==id)[0];
    if(!option)
      option = {
        id:id,
        name:id,
        type:"text"
      }

    
    if(!node || typeof node === 'object'){
      node = document.createElement("span");
      this.inputElement.nativeElement.appendChild(node);
    }
     
    let tagSpan:HTMLElement = this.renderer.createElement('span');
    if(this.notShow) {
      tagSpan.innerHTML = '';
    } else {
      this.renderer.addClass(tagSpan,"input-tag")
      tagSpan.innerHTML = option.name;
    }
    tagSpan.dataset.id = <string>option.id;
    tagSpan.dataset.type = option.type;
    /**reemplazamos el nodo anterior con el nuevo */
    if(node.parentElement.className == "parent-editable")
      node.parentElement.replaceChild(tagSpan,node);
    else
      node.parentElement.parentElement.replaceChild(tagSpan,node.parentElement);
    /**Inserto un espacio antes a menos que sea el primer elemento */
    if(this.inputElement.nativeElement.childNodes[0] !== tagSpan){
      let separator = document.createTextNode(" ");
      tagSpan.parentNode.insertBefore(separator,tagSpan);
    }
    /**creo un nuevo nodo que usaré para la nueva selección */
    let textNode = document.createTextNode(" ");
    /**inserto ese nodo justo después del que acabo de añadir*/
    this.insertAfter(textNode,tagSpan);
    this.lastNode = textNode;
    /**y luego posiciono el cursor en ese nodo */
    if(this.inputElement.nativeElement === document.activeElement){
      let range = document.createRange();
      range.setStart(textNode, 1); 
      range.setEnd(textNode, 1);
      let sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range)
    }
    if(emit)
      this.emitSelection();

    return textNode; 
  }

  /**
   * Delete all child of html element
   * @param element - to elment to be cleared
   */
  clearInput(element:HTMLElement):void{
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
  }

  /**
   * 
   * @param value - the value to acting
   */
  writeValue(value: any): void{
    console.log("test");
    /**need to know is value is an array or a single value */
    if(!this.flagEmmit){
      this.clearInput(this.inputElement.nativeElement);
      if(this.multiple && value){
        value.forEach(value => {
          this.insertTag(value,null,false);
        });
        this.values = value;
      }else if(value){
        this.insertTag(value,null,false);
        this.value = value;
      }
    }else{
      setTimeout(()=>{this.flagEmmit = false;},50);
      
    }

  }

  /**
   * The control value accesor onchange callback
   * @param fn - the function callback
   */
  registerOnChange(fn: any): void{
    this.onChange = fn;
  }

  /**
   * The control value accesor ontouch callback
   * @param fn -the function callback
   */
  registerOnTouched(fn: any): void{ 
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean):void{
    this.disabled = isDisabled;
  }

}
