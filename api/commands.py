import os
import click
from flask.cli import AppGroup
from flask import current_app

admin_cli = AppGroup('admin')


@admin_cli.command('remove')
@click.argument('filenames', nargs=-1)
def remove_sound(filenames):
    assets_path = os.path.join(current_app.root_path, 'static', 'assets')

    for filename in filenames:
        filepath = os.path.join(assets_path, 'contributions', filename)
        try:
            os.remove(filepath)
            print('Removed ' + filename)
        except e:
            click.echo('Cannot remove {}'.format(filename))

    filtered_sounds = None
    contributions_path = os.path.join(assets_path, 'contributions.cvs')
    with open(contributions_path, 'r') as contrib:
        filtered_sounds = [
            fn for fn in contrib.read().rstrip().split('\n')
            if fn not in filenames
        ]
    with open(contributions_path, 'w') as contrib:
        contrib.write('\n'.join(filtered_sounds) + '\n')
