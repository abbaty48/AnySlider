/**
 * FEATURES TO ADD
 * 1. make mulitiple slide effect
 */

import React from 'react';
import './AnySlider.scss';

export enum SlideEffects {
  Best = 'best',
  Bounce = 'bounce',
  BounceIn = 'bounceIn',
  BounceInUp = 'bounceInUp',
  BounceInDown = 'bounceInDown',
  BounceInLeft = 'bounceInLeft',
  BounceInRight = 'bounceInRight',
  BounceOut = 'bounceOut',
  BounceOutUp = 'bounceOutUp',
  BounceOutDown = 'bounceOutDown',
  BounceOutLeft = 'bounceOutLeft',
  BounceOutRight = 'bounceOutRight',
  FadeIn = 'fadeIn',
  FadeInUp = 'fadeInUp',
  FadeInDown = 'fadeInDown',
  FadeInLeft = 'fadeInLeft',
  FadeInRight = 'fadeInRight',
  FadeInUpBig = 'fadeInUpBig',
  FadeInDownBig = 'fadeInDownBig',
  FadeInLeftBig = 'fadeInLeftBig',
  FadeInRightBig = 'fadeInRightBig',
  FadeOut = 'fadeOut',
  FadeOutUp = 'fadeOutUp',
  FadeOutDown = 'fadeOutDown',
  FadeOutLeft = 'fadeOutLeft',
  FadeOutRight = 'fadeOutRight',
  FadeOutUpBig = 'fadeOutUpBig',
  FadeOutDownBig = 'fadeOutDownBig',
  FadeOutLeftBig = 'fadeOutLeftBig',
  FadeOutRightBig = 'fadeOutRightBig',
  Flip = 'flip',
  FlipInX = 'flipInX',
  FlipInY = 'flipInY',
  FlipOutX = 'flipOutX',
  FlipOutY = 'flipOutY',
  LightSpeedIn = 'lightSpeedIn',
  LightSpeedOut = 'lightSpeedOut',
  RotateIn = 'rotateIn',
  RotateOut = 'rotateOut',
  SlideInDown = 'slideInDown',
  SlideInLeft = 'slideInLeft',
  SlideInRight = 'slideInRight',
  SlideOutLeft = 'slideOutLeft',
  SlideOutRight = 'slideOutRight',
  SlideOutUp = 'slideOutUp',
  Hinge = 'hinge',
  RollIn = 'rollIn',
  RollOut = 'rollOut',
  Flash = 'flash',
  Pulse = 'pulse',
  Shake = 'shake',
  Swing = 'swing',
  Tada = 'tada',
  Wobble = 'wobble',
}

export enum NavigationAlignment {
  TopRight = 'topRight',
  TopLeft = 'topLeft',
  BottomRight = 'bottomRight',
  BottomLeft = 'bottomLeft',
  Center = 'center',
  LeftRight = 'leftRight'
}

interface IProps {
  showDots?: boolean,         // -- to show the dot position
  autoLoop?: boolean,         // -- to automatically start sliding
  loopDuration?: number,      // -- interval time of each loop
  showNavigations?: boolean,  // -- to show the navigations buttons Next,Previous
  slideEffect?: SlideEffects  // -- sliding effect to use
  pauseOnHover?: boolean,
  navigationsAlignment?: '',
  heightProportion?: 'auto' | 'fixed' | string
}

interface IState {
  isPause: boolean,
  slideIndex: number,
  slideEffect: SlideEffects,
  lastEffect?: string,
  autoLoop?: boolean;
  navigationAlignment: NavigationAlignment
}

export default class AnySlider extends React.Component<IProps, IState> {

  dotsRef = React.createRef<HTMLDivElement>()
  slidersContainerRef = React.createRef<HTMLDivElement>()

  constructor(props: IProps) {
    super(props)
    this.state = {
      slideIndex: 0,
      isPause: false,
      autoLoop: this.props.autoLoop ?? true,
      slideEffect: this.props.slideEffect ?? SlideEffects.Best,
      navigationAlignment: NavigationAlignment.LeftRight
    }
  }

  componentDidMount() {

    
    this.slidersContainerRef.current?.childNodes?.forEach((slider)=> {
       const element = (slider as HTMLElement);
      //  element.style.height = (this.props.heightProportion === 'fixed') ? element.offsetHeight : element;
    })

    this.onAutoLoop()
  }

  randomBestSlide = () : string => {
    const  effects: string[] = [ 
                                                      SlideEffects.FadeIn, SlideEffects.FadeInUp, SlideEffects.FadeInDown, SlideEffects.FadeInLeft, SlideEffects.FadeInRight,
                                                      SlideEffects.FadeInRightBig, SlideEffects.FadeInLeftBig, SlideEffects.FadeInUpBig, SlideEffects.FadeInDownBig,
                                                      SlideEffects.FadeOut, SlideEffects.FadeOutUpBig, SlideEffects.FadeOutDown, SlideEffects.FadeOutDownBig,
                                                      SlideEffects.BounceInDown, SlideEffects.BounceInLeft, SlideEffects.BounceInRight, SlideEffects.BounceInUp,
                                                      SlideEffects.FadeOutLeft, SlideEffects.FadeOutRight, SlideEffects.FadeOutUp,
                                                      SlideEffects.SlideInDown, SlideEffects.SlideInLeft, SlideEffects.SlideInRight
                                                    ];
    
    return effects[Math.round( Math.random() * effects.length)] ?? 'fadeIn' ;
  }

  shouldComponentUpdate() {return false}

  onAutoLoop = ()=> {
    if (this.state.autoLoop) {
      this.onSlideShow(this.state.slideIndex);
      setInterval(()=> {
        // pause the loop if pauseOnHover is true
        if (this.state.isPause && this.props.pauseOnHover) {
          return
        }
        this.onSlideShow(this.state.slideIndex);
        this.setState((prevState)=> {
          return {
            ...prevState,
            slideIndex : prevState.slideIndex + 1
          }
        })
      }, this.props.loopDuration ?? 2000)
    } else {
      this.onSlideShow(0)
    }
  }

  onPause = (toPause: boolean)=> {
    this.setState((prevState)=> {
      return {
        ...prevState,
        isPause: toPause
      }
    })
  }

  onSlideClick = (action: string) => {
    
    this.setState((prevState) => {
      const index = (action === 'prev' ? (prevState.slideIndex - 1) : (prevState.slideIndex + 1))
      return {
        ...prevState,
        slideIndex: index
      }
    }, ()=> {
      this.onSlideShow(this.state.slideIndex)
    });
    
  }
  
  onDot = (index: number) => {
    this.setState((prevState)=> {
      return {
        ...prevState,
        slideIndex: index
      }
    }, ()=> {
      this.onSlideShow(index);
    })
  }
  
  onSlideShow = (index: number) => {

    const totalSliders = this.slidersContainerRef.current?.childNodes.length ?? 0;
    const effect = (this.state.slideEffect === SlideEffects.Best) ? this.randomBestSlide() : this.state.slideEffect;
    const sliders = this.slidersContainerRef.current?.childNodes;
    const sliderItem = (sliders?.item(index) as HTMLElement);
    const dots = this.dotsRef.current?.childNodes;
    
     const reset = () => {
      sliders?.forEach((slider)=> {
        const element = (slider as HTMLElement);
        element.style.zIndex = '0';
        element.classList.remove(this.state.lastEffect, 'animated')
      })

      dots?.forEach((dot)=> {
        (dot as HTMLElement).classList.remove('active');
      })
    }
      // reset all the values
      reset();

      const setValues = () => {
        sliderItem!.classList.add('-slider-item', effect, 'animated')
        sliderItem!.style.zIndex = '1';
        (dots!.item(index) as HTMLElement).classList.add('active');
        this.setState({lastEffect :  effect})
      }
      
      if (index < 0) {
        this.setState({ slideIndex: totalSliders - 1 }, () => {
          this.onSlideShow(this.state.slideIndex)
          setValues()
        })
      } else if (index >= totalSliders) {
        this.setState({ slideIndex: 0 }, ()=> {
        this.onSlideShow(0)
        })
      } else {
          setValues()
      }
  }

  render() {
    return (
      <div className="AnySlider">
        {/* SLIDERS */}
        <div className="-sliders" ref={this.slidersContainerRef} onMouseEnter={()=> this.onPause(true)} onMouseLeave={()=> this.onPause(false)}>
          {
            this.props.children
          }
        </div>
        {
          /* NAVIGATIONS */
          this.props.showNavigations && (
            <div className="-slider--navigators" data-navigationalign={this.state.navigationAlignment}>
              <button type="button" className='-slider--nav_button preBtn' onClick={() => this.onSlideClick('prev')}>Prev</button>
              <button type="button" className='-slider--nav_button nextBtn' onClick={() => this.onSlideClick('next')}>Next</button>
            </div>
          )
        }
        {
          /* DOTS */
          this.props.showDots && (
            <div className="-slider--dots" ref={this.dotsRef}>
              {
                React.Children.map(this.props.children, (child, index)=> {
                  return <span className="dot" onClick={()=> this.onDot(index)}></span>
                })
              }
            </div>
          )
        }
      </div>
    )
  }
}


