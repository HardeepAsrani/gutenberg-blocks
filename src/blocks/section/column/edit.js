/**
 * External dependencies
 */
import hexToRgba from 'hex-rgba';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { ResizableBox } = wp.components;

const { compose } = wp.compose;

const {
	withDispatch,
	withSelect
} = wp.data;

const { InnerBlocks } = wp.blockEditor;

const {
	Fragment,
	useEffect,
	useState
} = wp.element;

const { withViewportMatch } = wp.viewport;

/**
 * Internal dependencies
 */
import layouts from '../layouts.js';
import Inspector from './inspector.js';

const Edit = ({
	attributes,
	setAttributes,
	className,
	clientId,
	toggleSelection,
	updateBlockAttributes,
	adjacentBlockClientId,
	adjacentBlock,
	parentClientId,
	parentBlock,
	hasInnerBlocks,
	isLarger,
	isLarge,
	isSmall,
	isSmaller
}) => {
	useEffect( () => {
		initBlock();
	}, []);

	const initBlock = () => {
		if ( attributes.id === undefined || attributes.id.substr( attributes.id.length - 8 ) !== clientId.substr( 0, 8 ) ) {
			const instanceId = `wp-block-themeisle-blocks-advanced-column-${ clientId.substr( 0, 8 ) }`;
			setAttributes({ id: instanceId });
		}
	};

	const [ currentWidth, setCurrentWidth ] = useState( 0 );
	const [ nextWidth, setNextWidth ] = useState( 0 );

	const isDesktop = ( isLarger && ! isLarge && isSmall && ! isSmaller );

	const isTablet = ( ! isLarger && ! isLarge && isSmall && ! isSmaller );

	const isMobile = ( ! isLarger && ! isLarge && ! isSmall && ! isSmaller );

	if ( attributes.columnWidth === undefined ) {
		( parentBlock.innerBlocks ).map( ( innerBlock, i ) => {
			if ( clientId === innerBlock.clientId ) {
				const columns = parentBlock.attributes.columns;
				const layout = parentBlock.attributes.layout;
				updateBlockAttributes( clientId, {
					columnWidth: parseFloat( layouts[columns][layout][i])
				});
			}
		});
	}

	const columnContainer = document.getElementById( `block-${ clientId }` );

	if ( null !== columnContainer ) {
		if ( isDesktop ) {
			columnContainer.style.flexBasis = `${ attributes.columnWidth }%`;
		} else {
			columnContainer.style.flexBasis = '';
		}
	}

	const onResizeStart = ( event, direction, elt, delta ) => {
		const handle = document.querySelector( `#block-${ clientId } .wp-themeisle-block-advanced-column-resize-container-handle .components-resizable-box__handle` );
		const handleTooltipLeft = document.createElement( 'div' );
		const handleTooltipRight = document.createElement( 'div' );

		handleTooltipLeft.setAttribute( 'class', 'resizable-tooltip resizable-tooltip-left' );
		handleTooltipLeft.innerHTML = `${ parseFloat( attributes.columnWidth ).toFixed( 0 ) }%`;
		handle.appendChild( handleTooltipLeft );
		handleTooltipRight.setAttribute( 'class', 'resizable-tooltip resizable-tooltip-right' );
		handleTooltipRight.innerHTML = `${ parseFloat( adjacentBlock.attributes.columnWidth ).toFixed( 0 ) }%`;
		handle.appendChild( handleTooltipRight );

		setCurrentWidth( attributes.columnWidth );
		setNextWidth( adjacentBlock.attributes.columnWidth );
		toggleSelection( false );
	};

	const onResize = ( event, direction, elt, delta ) => {
		const parent = document.getElementById( `block-${ parentClientId }` );
		const parentWidth = parent.getBoundingClientRect().width;
		const changedWidth = ( delta.width / parentWidth ) * 100;
		const width = parseFloat( currentWidth ) + changedWidth;
		const nextColumnWidth = nextWidth - changedWidth;
		const handleTooltipLeft = document.querySelector( '.resizable-tooltip-left' );
		const handleTooltipRight = document.querySelector( '.resizable-tooltip-right' );

		if ( 10 <= width && 10 <= nextColumnWidth ) {
			handleTooltipLeft.innerHTML = `${ width.toFixed( 0 ) }%`;
			handleTooltipRight.innerHTML = `${ nextColumnWidth.toFixed( 0 ) }%`;

			setAttributes({ columnWidth: width.toFixed( 2 ) });
			updateBlockAttributes( adjacentBlockClientId, {
				columnWidth: nextColumnWidth.toFixed( 2 )
			});
		}
	};

	const onResizeStop = ( event, direction, elt, delta ) => {
		const handleTooltipLeft = document.querySelector( '.resizable-tooltip-left' );
		const handleTooltipRight = document.querySelector( '.resizable-tooltip-right' );

		handleTooltipLeft.parentNode.removeChild( handleTooltipLeft );
		handleTooltipRight.parentNode.removeChild( handleTooltipRight );
		toggleSelection( true );
	};

	const Tag = attributes.columnsHTMLTag;

	let stylesheet, background, borderStyle, borderRadiusStyle, boxShadowStyle;

	if ( isDesktop ) {
		stylesheet = {
			paddingTop: 'linked' === attributes.paddingType ? `${ attributes.padding }px` : `${ attributes.paddingTop }px`,
			paddingRight: 'linked' === attributes.paddingType ? `${ attributes.padding }px` : `${ attributes.paddingRight }px`,
			paddingBottom: 'linked' === attributes.paddingType ? `${ attributes.padding }px` : `${ attributes.paddingBottom }px`,
			paddingLeft: 'linked' === attributes.paddingType ? `${ attributes.padding }px` : `${ attributes.paddingLeft }px`,
			marginTop: 'linked' === attributes.marginType ? `${ attributes.margin }px` : `${ attributes.marginTop }px`,
			marginRight: 'linked' === attributes.marginType ? `${ attributes.margin }px` : `${ attributes.marginRight }px`,
			marginBottom: 'linked' === attributes.marginType ? `${ attributes.margin }px` : `${ attributes.marginBottom }px`,
			marginLeft: 'linked' === attributes.marginType ? `${ attributes.margin }px` : `${ attributes.marginLeft }px`
		};
	}

	if ( isTablet ) {
		stylesheet = {
			paddingTop: 'linked' === attributes.paddingTypeTablet ? `${ attributes.paddingTablet }px` : `${ attributes.paddingTopTablet }px`,
			paddingRight: 'linked' === attributes.paddingTypeTablet ? `${ attributes.paddingTablet }px` : `${ attributes.paddingRightTablet }px`,
			paddingBottom: 'linked' === attributes.paddingTypeTablet ? `${ attributes.paddingTablet }px` : `${ attributes.paddingBottomTablet }px`,
			paddingLeft: 'linked' === attributes.paddingTypeTablet ? `${ attributes.paddingTablet }px` : `${ attributes.paddingLeftTablet }px`,
			marginTop: 'linked' === attributes.marginTypeTablet ? `${ attributes.marginTablet }px` : `${ attributes.marginTopTablet }px`,
			marginRight: 'linked' === attributes.marginTypeTablet ? `${ attributes.marginTablet }px` : `${ attributes.marginRightTablet }px`,
			marginBottom: 'linked' === attributes.marginTypeTablet ? `${ attributes.marginTablet }px` : `${ attributes.marginBottomTablet }px`,
			marginLeft: 'linked' === attributes.marginTypeTablet ? `${ attributes.marginTablet }px` : `${ attributes.marginLeftTablet }px`
		};
	}

	if ( isMobile ) {
		stylesheet = {
			paddingTop: 'linked' === attributes.paddingTypeMobile ? `${ attributes.paddingMobile }px` : `${ attributes.paddingTopMobile }px`,
			paddingRight: 'linked' === attributes.paddingTypeMobile ? `${ attributes.paddingMobile }px` : `${ attributes.paddingRightMobile }px`,
			paddingBottom: 'linked' === attributes.paddingTypeMobile ? `${ attributes.paddingMobile }px` : `${ attributes.paddingBottomMobile }px`,
			paddingLeft: 'linked' === attributes.paddingTypeMobile ? `${ attributes.paddingMobile }px` : `${ attributes.paddingLeftMobile }px`,
			marginTop: 'linked' === attributes.marginTypeMobile ? `${ attributes.marginMobile }px` : `${ attributes.marginTopMobile }px`,
			marginRight: 'linked' === attributes.marginTypeMobile ? `${ attributes.marginMobile }px` : `${ attributes.marginRightMobile }px`,
			marginBottom: 'linked' === attributes.marginTypeMobile ? `${ attributes.marginMobile }px` : `${ attributes.marginBottomMobile }px`,
			marginLeft: 'linked' === attributes.marginTypeMobile ? `${ attributes.marginMobile }px` : `${ attributes.marginLeftMobile }px`
		};
	}

	if ( 'color' === attributes.backgroundType ) {
		background = {
			background: attributes.backgroundColor
		};
	}

	if ( 'image' === attributes.backgroundType ) {
		background = {
			backgroundImage: `url( '${ attributes.backgroundImageURL }' )`,
			backgroundAttachment: attributes.backgroundAttachment,
			backgroundPosition: attributes.backgroundPosition,
			backgroundRepeat: attributes.backgroundRepeat,
			backgroundSize: attributes.backgroundSize
		};
	}

	if ( 'gradient' === attributes.backgroundType ) {
		let direction;

		if ( 'linear' === attributes.backgroundGradientType ) {
			direction = `${ attributes.backgroundGradientAngle }deg`;
		} else {
			direction = `at ${ attributes.backgroundGradientPosition }`;
		}

		if ( attributes.backgroundGradientFirstColor || attributes.backgroundGradientSecondColor ) {
			background = {
				background: `${ attributes.backgroundGradientType }-gradient( ${ direction }, ${ attributes.backgroundGradientFirstColor || 'rgba( 0, 0, 0, 0 )' } ${ attributes.backgroundGradientFirstLocation }%, ${ attributes.backgroundGradientSecondColor || 'rgba( 0, 0, 0, 0 )' } ${ attributes.backgroundGradientSecondLocation }% )`
			};
		}
	}

	if ( 'linked' === attributes.borderType ) {
		borderStyle = {
			borderWidth: `${ attributes.border }px`,
			borderStyle: 'solid',
			borderColor: attributes.borderColor
		};
	}

	if ( 'unlinked' === attributes.borderType ) {
		borderStyle = {
			borderTopWidth: `${ attributes.borderTop }px`,
			borderRightWidth: `${ attributes.borderRight }px`,
			borderBottomWidth: `${ attributes.borderBottom }px`,
			borderLeftWidth: `${ attributes.borderLeft }px`,
			borderStyle: 'solid',
			borderColor: attributes.borderColor
		};
	}

	if ( 'linked' === attributes.borderRadiusType ) {
		borderRadiusStyle = {
			borderRadius: `${ attributes.borderRadius }px`
		};
	}

	if ( 'unlinked' === attributes.borderRadiusType ) {
		borderRadiusStyle = {
			borderTopLeftRadius: `${ attributes.borderRadiusTop }px`,
			borderTopRightRadius: `${ attributes.borderRadiusRight }px`,
			borderBottomRightRadius: `${ attributes.borderRadiusBottom }px`,
			borderBottomLeftRadius: `${ attributes.borderRadiusLeft }px`
		};
	}

	if ( true === attributes.boxShadow ) {
		boxShadowStyle = {
			boxShadow: `${ attributes.boxShadowHorizontal }px ${ attributes.boxShadowVertical }px ${ attributes.boxShadowBlur }px ${ attributes.boxShadowSpread }px ${  hexToRgba( ( attributes.boxShadowColor ? attributes.boxShadowColor : '#000000' ), attributes.boxShadowColorOpacity ) }`
		};
	}

	const style = {
		...stylesheet,
		...background,
		...borderStyle,
		...borderRadiusStyle,
		...boxShadowStyle
	};

	return (
		<Fragment>
			<Inspector
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>

			<ResizableBox
				className="block-library-spacer__resize-container wp-themeisle-block-advanced-column-resize-container"
				enable={ {
					right: adjacentBlockClientId ? true : false
				} }
				handleWrapperClass="wp-themeisle-block-advanced-column-resize-container-handle"
				onResizeStart={ onResizeStart }
				onResize={ onResize }
				onResizeStop={ onResizeStop }
			>
				<Tag
					className={ className }
					id={ attributes.id }
					style={ style }
				>
					<InnerBlocks
						templateLock={ false }
						renderAppender={ ! hasInnerBlocks && InnerBlocks.ButtonBlockAppender }
					/>
				</Tag>
			</ResizableBox>
		</Fragment>
	);
};

export default compose(
	withDispatch( ( dispatch ) => {
		const { updateBlockAttributes } = dispatch( 'core/block-editor' );

		return {
			updateBlockAttributes
		};
	}),

	withSelect( ( select, props ) => {
		const { clientId } = props;
		const {
			getAdjacentBlockClientId,
			getBlock,
			getBlockRootClientId
		} = select( 'core/block-editor' );
		const block = getBlock( clientId );
		const adjacentBlockClientId = getAdjacentBlockClientId( clientId );
		const adjacentBlock = getBlock( adjacentBlockClientId );
		const parentClientId = getBlockRootClientId( clientId );
		const parentBlock = getBlock( parentClientId );
		const hasInnerBlocks = !! ( block && block.innerBlocks.length );

		return {
			adjacentBlockClientId,
			adjacentBlock,
			parentClientId,
			parentBlock,
			hasInnerBlocks
		};
	}),

	withViewportMatch({
		isLarger: '>= large',
		isLarge: '<= large',
		isSmall: '>= small',
		isSmaller: '<= small'
	})

)( Edit );
