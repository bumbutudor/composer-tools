import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
// import { baseKeymap } from 'tiptap-commands';
import TextEditor from 'flarum/common/components/TextEditor';
// import CommentPost from 'flarum/forum/components/CommentPost';
import ComposerBody from 'flarum/components/ComposerBody';
import Button from 'flarum/components/Button';
import Tooltip from 'flarum/common/components/Tooltip';
import ItemList from 'flarum/common/utils/ItemList';
import listItems from 'flarum/common/helpers/listItems';
import Alert from 'flarum/common/components/Alert';


app.initializers.add('tudor/editor-tools', () => {
  /* buton in toolbar */
  /* extend(TextEditor.prototype, 'toolbarItems', function (items) {
      items.add(
        'diacritics',
        Tooltip.component(
          {
            text: app.translator.trans('editor-tools.forum.composer.toolbar.diacritice_button_tooltip'),
          },
          Button.component(
            {
              className: 'Button Button--secondary',
              icon: 'fas fa-link',
              onclick: () => ComposerBody.prototype.putDiacritice(),
            },
            app.translator.trans('editor-tools.forum.composer.toolbar.diacritice_button'),
          ),
        ),
      );
      return items;
    }); */
  
    /* add button in leftToolbarMenu  */
   ComposerBody.prototype.leftToolbarMenu = function () {
    const items = new ItemList();

    items.add(
      'diacritics',
      Button.component(
        {
          className: 'Button Button--secondary leftToolbarMenuItemButton',
          loading: this.loadingButton,
          onclick: () => this.putDiacritice(),
        },
        app.translator.trans('editor-tools.forum.composer.diacritice_button'),
      ),
    );

    return items;
  }

  /* add leftToolbarMenu in composer */  
  extend(ComposerBody.prototype, 'view', function (view) {
    view.children[0].children.push(
      <ul className="leftToolbarMenu">
        <label className='leftToolbarMenuLabel'>Instrumente speciale</label>
        {listItems(this.leftToolbarMenu().toArray())}
      </ul>);
  });

  
  // extend(ComposerBody.prototype, 'oninit', function () {
  //   this.loadingButton = false;
  // });

  // nu lucreaza cu rich text editor
  ComposerBody.prototype.putDiacritice = async function () {
    this.loadingButton = true;
    const value = this.composer.fields.content();
    

    if (value == '') {
      this.loadingButton = false;
      app.alerts.show(
        Alert,
        {
          type: 'warning',
        },
        app.translator.trans('editor-tools.forum.composer.alert.empty_warning_text')
      );
      return;
    }
    
   
    let response = await fetch('https://tools.emoldova.org/tools/diacritice', {
      method: 'POST',
      body: JSON.stringify({
        text: value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    if (result.text) {
      console.log(result);
      app.composer.editor.el.value = result.text;

      app.alerts.show(
        Alert,
        {
          type: 'success',
        },
        app.translator.trans('editor-tools.forum.composer.alert.success_text')
      );
    } else {
      console.log(result)
      app.alerts.show(
        Alert,
        {
          type: 'error',
        },
        app.translator.trans('editor-tools.forum.composer.alert.error_text')
      );
    }


    

    
    this.loadingButton = false;

  
  }



});
