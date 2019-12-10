import { mount } from '@vue/test-utils'

import EmotionsButton from './EmotionsButton.vue'

const localVue = global.localVue

describe('EmotionsButton.vue', () => {
    let propsData = {}
  
    const Wrapper = () => {
      return mount(EmotionsButton, {
        localVue,
        propsData
      })
    }
  
    it('renders no image', () => {
        expect(
          Wrapper()
            .find('img')
            .exists(),
        ).toBe(false)
      })

      it('renders an icon emotion', () => {
        expect(
          Wrapper()
            .find('.emotions-buttons')
            .exists(),
        ).toBe(true)
      })

      describe('with an absolute emotion url', () => {
        beforeEach(() => {
          propsData = {
            iconPath: '/img/svg/emoji/surprised.svg',
            }
        })
  
        it('keeps the emotion URL as is', () => {
          // e.g. our seeds have absolute image URLs
          expect(
            Wrapper()
              .find('img')
              .attributes('src'),
          ).toBe('/img/svg/emoji/surprised.svg')
        })
      })
  
  })