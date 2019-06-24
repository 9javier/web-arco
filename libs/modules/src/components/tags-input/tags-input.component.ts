import { Component, OnInit, Input, forwardRef, ViewChild, ElementRef,ViewChildren, QueryList, Query } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR  } from '@angular/forms';
import { Enum } from './models/enum.model';

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

  @Input() set options(options){
    if(options.length){
      this._options =options
      this.writeValue(this.value);
    }
  }

  /**The placeholder to be showed */
  @Input() placeholder = "";

  /**If this is true return an array */
  @Input() multiple:boolean;

  /**Options to be selected*/
  _options:Array<Enum> = [];

  /**Options DOM elements to scroll */
  @ViewChildren("optionList") optionsElements:QueryList<ElementRef>;

  /**Option pointer index, using for select the option with the keyboard*/
  optionPointerIndex:number = 0;

  /**Selected option */
  selectedOption:Enum;

  /**The current typed text transformed into option */
  currentTextOption:Enum;

  /**Filtered options to be showeds */
  filteredOptions:Array<Enum> = [];

  selectedsOptions:Array<Enum> = [];

  filterOptions(options:Array<Enum>,text:string):Array<Enum>{
    return options.filter(option=>option.name.toLowerCase().includes(text.toLowerCase()));
  }

  /**
   * Select option via input options
   * @param option - the selected option
   */
  selectOption(option:Enum):void{
    this.filteredOptions = [];
    this.selectedOption = option;
    if(!this.multiple)
      this.onChange(option.id);
    else
      this.onChange(option.id?[option.id]:[]);
    this.onTouch();
    this.selectedsOptions = [option];
    if(this.inputElement) 
      this.inputElement.nativeElement.value = "";
  }

  /**
   * empty the current selected option
   */
  emptyOption():void{
    this.selectedOption = null;
    this.filteredOptions = [];
    if(!this.multiple)
      this.onChange("");
    else
      this.onChange([]);
    this.onTouch();
  }

  /**
   * Using for select the option with the keyboard
   * @param event -the keypress event
   */
  onKeyUp(event):void{
    let key = event.key;
    if(key == 'Enter')
      this.selectOption(this.filteredOptions[this.optionPointerIndex]);
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

  constructor() { }

  ngOnInit() {
  }

  /**
   * Function that be triggered when user input a text
   */
  onInput(event):void{

    let text = this.inputElement.nativeElement.value;
 
    this.filteredOptions = text?this.filterOptions(this._options,text):[];
    /**if not have exactyle coincidence add the current text as option */
    if(text && !this._options.find(option=>option.name.toLowerCase()==text.toLowerCase())){
      this.currentTextOption = {
        id:text,
        name:text
      }
      this.filteredOptions = [this.currentTextOption].concat(this.filteredOptions);
    }
    //this.onChange(text);
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
   * @param value - the value to acting
   */
  writeValue(value: any): void{
    console.log("entra");
    this.value = value;
    /*if(this.inputElement)
      this.inputElement.nativeElement.value = value;*/
    let selected = this._options.filter(option=>option.id==value)
    console.log(this._options);
    /**If have positions*/
    if(selected.length){
      console.log("entra ac[a",selected)
      this.selectOption(selected[0]);
    }else if(value){
      console.log("no entra aca");
      this.selectOption({
        id:value,
        name:value
      })
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
