# Generated by Django 4.0.2 on 2022-02-19 21:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0002_create_super_user'),
    ]

    operations = [
        migrations.RenameField(
            model_name='label',
            old_name='questions_hint',
            new_name='description',
        ),
    ]
