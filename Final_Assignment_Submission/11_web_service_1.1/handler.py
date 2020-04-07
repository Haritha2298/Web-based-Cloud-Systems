from ladon.server.wsgi import LadonWSGIApplication
from os.path import normpath, abspath, dirname, join
from ladon.tools.log import set_loglevel, set_logfile, set_log_backup_count, set_log_maxsize

scriptdir = dirname(abspath(__file__))
service_modules = ['calculator']

# Create the WSGI Application
application = LadonWSGIApplication(
    service_modules,
    [join(scriptdir, 'services'), join(scriptdir, 'appearance')],
    catalog_name='Ladon Service Examples',
    catalog_desc='The services in this catalog serve as examples to how Ladon is used',
    logging=31)
