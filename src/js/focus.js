/* Focus Photo Gallery
 *
 * Version 1.0.1
 */

/* eslint-disable no-unused-vars */
const focus = (focusOptions) => {
    const bodyElement = document.querySelector('body')
    let backstage = {
        startingItem: '',
        currentItem: '',
        images: '',
        imageCount: 0,
        isLoading: false,
        currentFocus: '',
    }

    const init = () => {
        const selector = focusOptions && focusOptions.selector ? focusOptions.selector : '.focus-gallery'
        const galleries = document.querySelectorAll(selector)
        const activeGalleries = []
        
        // Check to see if there are any anchor tags in any of the galleries
        Array.from(galleries).forEach((gallery) => {
            const galleryAnchors = gallery.querySelectorAll('a')
            if ( galleryAnchors && galleryAnchors.length ) {
                activeGalleries.push(gallery)
            }
        })
        
        if (activeGalleries) {
            createStage()

            activeGalleries.forEach((gallery) => {
                attachHandlers(gallery)
            })
        }
    }

    const createStage = () => {
        const stage = document.createElement('div')
        stage.classList.add('focus-stage')
        stage.setAttribute('role', 'dialog')
        stage.setAttribute('aria-labelledby', 'focus-stage-title')

        const stageTitle = document.createElement('h1')
        stageTitle.innerText = 'Photo Gallery'
        stageTitle.setAttribute('id', 'focus-stage-title')
        stageTitle.setAttribute('class', 'screen-reader-text')
        stage.appendChild(stageTitle)

        const loadingIcon = createLoadingIcon()
        stage.appendChild(loadingIcon)

        const podium = document.createElement('div')
        podium.classList.add('focus-podium')
        stage.appendChild(podium)

        const closeButton = createCloseButton()
        stage.appendChild(closeButton)

        const controls = createControls()
        stage.appendChild(controls)

        bodyElement.appendChild(stage)
    }

    const createCloseButton = () => {
        const closeButton = document.createElement('button')
        closeButton.innerHTML = '<span class="screen-reader-text">Close</span>'
        closeButton.classList.add('focus-close')

        return closeButton
    }

    const createControls = () => {
        const controls = document.createElement('div')
        controls.classList.add('focus-controls')

        const next = document.createElement('button')
        next.innerHTML = '<span class="screen-reader-text">Next</span>'
        next.classList.add('focus-next')
        controls.appendChild(next)

        const previous = document.createElement('button')
        previous.innerHTML = '<span class="screen-reader-text">Previous</span>'
        previous.classList.add('focus-previous')
        controls.appendChild(previous)

        return controls
    }

    const createLoadingIcon = () => {
        const loadingIcon = document.createElement('div')
        loadingIcon.innerHTML = '<svg class="loading-icon" viewBox="25 25 50 50" stroke-width="2"><circle cx="50" cy="50" r="20" /></svg><span class="screen-reader-text">Loading</span>'
        loadingIcon.classList.add('focus-loading')

        return loadingIcon
    }

    const lockFocus = (e) => {
        backstage.currentFocus = e.currentTarget
        document.addEventListener('keydown', modalTab)
    }

    const unlockFocus = () => {
        backstage.currentFocus.focus()
        document.removeEventListener('keydown', modalTab)
    }

    const modalTab = (event) => {
        const focusableSelectors = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex^="-"])']

        const modal = document.querySelector('.focus-stage')
        const focusableElements = [].slice.call( modal.querySelectorAll( focusableSelectors.join() ) )

        if (event.keyCode === 9) {
            // Get the index of the currently focused element within the modal
            var focusedIndex = focusableElements.indexOf(document.activeElement)

            // If the shift key is not in use, check to see if we're on the last element
            if (!event.shiftKey && focusedIndex === focusableElements.length - 1) {
                // Focus first item within modal
                focusableElements[0].focus()
                event.preventDefault()
            // If the shift key is in use, we're going backwards, so check to see if we're on the first element
            } else if (event.shiftKey && (focusedIndex === 0 || focusedIndex === -1)) {
                // Focus last item within modal
                focusableElements[focusableElements.length - 1].focus()
                event.preventDefault()
            }
        }
    }

    const openStage = (e) => {
        bodyElement.classList.add('focus-stage-open')
        if (backstage.imageCount === 1) {
            document.querySelector('.focus-stage').classList.add('controls-hidden')
            document.querySelector('.focus-previous').setAttribute('disabled', '')
            document.querySelector('.focus-next').setAttribute('disabled', '')
        }

        const ul = document.createElement('ul')

        backstage.images.forEach((image, index) => {
            const listItem = document.createElement('li')
            const figureElement = document.createElement('figure')
            const imageElement = document.createElement('img')
            imageElement.setAttribute('data-src', image.imageUrl)
            imageElement.setAttribute('alt', image.imageAlt)
            figureElement.appendChild(imageElement)
            listItem.appendChild(figureElement)
            listItem.classList.add('stage-item')

            if (image.imageCaption !== '') {
                const imageCaption = document.createElement('figcaption')
                imageCaption.innerText = image.imageCaption
                figureElement.appendChild(imageCaption)
                listItem.classList.add('has-caption')
            }

            if (index === backstage.startingItem) {
                listItem.classList.add('is-active', 'is-first')
                const imageSrc = imageElement.getAttribute('data-src')
                imageElement.setAttribute('src', imageSrc)
                loadingHandler(imageElement)
            }

            ul.appendChild(listItem)
        })
        
        // Set the stage
        const podium = document.querySelector('.focus-podium')
        setTimeout(() => podium.appendChild(ul), 150)

        document.addEventListener('click', handleNavigationEvents)
        document.addEventListener('keydown', handleNavigationEvents)
        lockFocus(e)
        if (backstage.imageCount === 1) {
            document.querySelector('.focus-close').focus()
        } else {
            document.querySelector('.focus-next').focus()
        }
        handleRestartStatus()
    }

    const handleNavigationEvents = (e) => {
        if (e.type === 'click' && e.target && e.target.classList.contains('focus-next')) goToNextImage()
        if (e.type === 'click' && e.target && e.target.classList.contains('focus-previous')) goToPreviousImage()
        if (e.type === 'click' && e.target && e.target.classList.contains('focus-close')) closeStage()
        if (e.key === 'Escape') closeStage()
        if (e.keyCode === 37) goToPreviousImage()
        if (e.keyCode === 39) goToNextImage()
    }

    const handleRestartStatus = () => {
        const nextButton = document.querySelector('.focus-next')

        if (backstage.currentItem + 1 === backstage.imageCount) {
            nextButton.classList.add('is-restart')
            nextButton.querySelector('.screen-reader-text').innerHTML = 'Restart'
        } else {
            nextButton.classList.remove('is-restart')
            nextButton.querySelector('.screen-reader-text').innerHTML = 'Previous'
        }
    }

    const closeStage = () => {
        // Remove class from body
        bodyElement.classList.remove('focus-stage-open')
        document.querySelector('.focus-stage').classList.remove('controls-hidden')
        document.querySelector('.focus-previous').removeAttribute('disabled')
        document.querySelector('.focus-next').removeAttribute('disabled')
        // Clear the stage
        const podium = document.querySelector('.focus-podium')
        podium.innerHTML = ''
        podium.classList.remove('has-caption')
        document.removeEventListener('click', handleNavigationEvents)
        document.removeEventListener('keydown', handleNavigationEvents)
        unlockFocus()
    }

    const goToNextImage = () => {
        if (backstage.currentItem + 1 < backstage.imageCount) {
            backstage.currentItem = backstage.currentItem + 1
        } else {
            backstage.currentItem = 0
        }
        handleRestartStatus()
        document.querySelector('.is-active').classList.remove('is-active')
        const stageItems = document.querySelectorAll('.stage-item')
        const currentItem = stageItems[backstage.currentItem]
        const currentItemImage = currentItem.querySelector('img')
        if (! currentItemImage.hasAttribute('src')) {
            currentItemImage.setAttribute('src', currentItemImage.getAttribute('data-src'))
        }
        currentItem.classList.add('is-active')
        loadingHandler(currentItemImage)
    }

    const goToPreviousImage = () => {
        if (backstage.currentItem - 1 < 0) {
            backstage.currentItem = backstage.imageCount - 1
        } else {
            backstage.currentItem = backstage.currentItem - 1
        }
        handleRestartStatus()
        document.querySelector('.is-active').classList.remove('is-active')
        const stageItems = document.querySelectorAll('.stage-item')
        const currentItem = stageItems[backstage.currentItem]
        const currentItemImage = currentItem.querySelector('img')
        if (! currentItemImage.hasAttribute('src')) {
            currentItemImage.setAttribute('src', currentItemImage.getAttribute('data-src'))
        }
        currentItem.classList.add('is-active')
        loadingHandler(currentItemImage)
    }

    const createImageItem = (imageItem) => {
        const image = {
            imageUrl: imageItem.href || imageItem.querySelector('a').href,
            imageAlt: imageItem.querySelector('img') ? imageItem.querySelector('img').alt : '',
            imageCaption: imageItem.querySelector('figcaption') ? imageItem.querySelector('figcaption').innerText : ''
        }
        return image
    }

    const anchorClickHandler = (index, event, images) => {
        event.preventDefault()

        backstage.startingItem = index
        backstage.currentItem = index
        backstage.images = images
        backstage.imageCount = images.length
        
        // Open stage with all items and index of opening item
        openStage(event)
    }

    const attachHandlers = (gallery) => {
        const galleryItems = gallery.children.length > 1 ? Array.from(gallery.children) : [gallery]

        const images = Array.from(galleryItems).map((item) => {
            return createImageItem(item)
        })

        for (let index = 0; index < galleryItems.length; index++) {
            const anchor = galleryItems[index].querySelector('a')
            anchor.addEventListener('click', (event) => anchorClickHandler(index, event, images))
        }
    }

    const loadingHandler = (image) => {
        const loadingIcon = document.querySelector('.focus-loading')

        const loadingComplete = () => {
            backstage.isLoading = false
            loadingIcon.classList.remove('is-active')

            image.removeEventListener('load', loadingComplete)
        }

        if (!image.complete) {
            backstage.isLoading = true
            loadingIcon.classList.add('is-active')

            image.addEventListener('load', loadingComplete)
            image.addEventListener('error', loadingComplete)
        } else {
            loadingComplete()
        }
    }

    init()
}